import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as ccxt from 'ccxt';
import { TradeService } from '../trade/trade.service';
import { StrategyDto } from './strategy.dto';

@Injectable()
export class StrategyService {
  private readonly logger = new Logger(StrategyService.name);

  private orderBookCache = new Map<
    string,
    { data: ccxt.OrderBook; timestamp: number }
  >();
  private strategyInstances = new Map<
    string,
    { isRunning: boolean; intervalId: NodeJS.Timeout }
  >();
  private exchanges = new Map<string, ccxt.Exchange>();
  private activeOrderBookWatches = new Map<string, Set<string>>(); // Tracks active watches for each strategy

  constructor(private tradeService: TradeService) {
    this.initializeExchanges();
    process.on('SIGINT', () => this.handleShutdown());
    process.on('SIGTERM', () => this.handleShutdown());
    process.on('uncaughtException', () => this.handleShutdown());
  }

  private async initializeExchanges() {
    // Initialize exchanges
    this.exchanges.set(
      'bitfinex',
      new ccxt.pro.bitfinex({
        apiKey: process.env.BITFINEX_API_KEY,
        secret: process.env.BITFINEX_SECRET,
      }),
    );
    this.exchanges.set(
      'mexc',
      new ccxt.pro.mexc({
        apiKey: process.env.MEXC_API_KEY,
        secret: process.env.MEXC_SECRET,
      }),
    );
    this.exchanges.set(
      'binance',
      new ccxt.pro.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
      }),
    );
  }

  async getSupportedExchanges(): Promise<string[]> {
    const supportedExchanges: string[] = [];
    this.exchanges.forEach((_, exchangeName) => {
      supportedExchanges.push(exchangeName);
    });
    return supportedExchanges;
  }

  async startArbitrageStrategyForUser(strategyParamsDto: StrategyDto) {
    const {
      userId,
      clientId,
      pair,
      minProfitability,
      exchangeAName,
      exchangeBName,
    } = strategyParamsDto;
    const strategyKey = `${userId}-${clientId}`;
    const exchangeA: ccxt.Exchange = this.exchanges.get(exchangeAName);
    const exchangeB: ccxt.Exchange = this.exchanges.get(exchangeBName);

    if (!exchangeA || !exchangeB) {
      this.logger.error(
        `Exchanges ${exchangeAName} or ${exchangeBName} are not configured.`,
      );
      throw new InternalServerErrorException('Exchange configuration error.');
    }

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.log(
        `Strategy already running for user ${userId} and client ${clientId}`,
      );
      return;
    }

    this.logger.log(
      `Starting arbitrage strategy for user ${userId}, client ${clientId}`,
    );
    // Add the pair to active watches for this strategy
    const watchSet = this.activeOrderBookWatches.get(strategyKey) || new Set();
    watchSet.add(pair);
    this.activeOrderBookWatches.set(strategyKey, watchSet);

    this.watchSymbols(exchangeA, exchangeB, pair, strategyKey);

    const intervalId = setInterval(() => {
      this.evaluateArbitrageOpportunityVWAP(
        exchangeA,
        exchangeB,
        userId,
        clientId,
        pair,
        strategyParamsDto.amountToTrade,
        minProfitability,
      );
    }, 1000); // Run every 1 seconds

    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  async stopArbitrageStrategyForUser(userId: string, clientId: string) {
    const strategyKey = `${userId}-${clientId}`;
    const strategyInstance = this.strategyInstances.get(strategyKey);

    if (strategyInstance) {
      clearInterval(strategyInstance.intervalId);
      this.strategyInstances.delete(strategyKey);
      this.logger.log(
        `Stopped arbitrage strategy for user ${userId}, client ${clientId}`,
      );

      // Remove the pairs from active watches
      this.activeOrderBookWatches.delete(strategyKey);
    }
  }

  private async watchSymbols(
    exchangeA,
    exchangeB,
    pair: string,
    strategyKey: string,
  ) {
    this.watchOrderBook(exchangeA, pair, strategyKey);
    this.watchOrderBook(exchangeB, pair, strategyKey);
  }

  private async watchOrderBook(
    exchange: ccxt.Exchange,
    symbol: string,
    strategyKey: string,
  ) {
    while (this.activeOrderBookWatches.get(strategyKey)?.has(symbol)) {
      try {
        const newOrderbook = await exchange.watchOrderBook(symbol);
        this.orderBookCache.set(symbol + '-' + exchange.id, {
          data: newOrderbook,
          timestamp: Date.now(),
        });
        // Notify strategies if needed
      } catch (error) {
        this.logger.error(`Error in watchOrderBook: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  private async evaluateArbitrageOpportunityVWAP(
    exchangeA,
    exchangeB,
    userId: string,
    clientId: string,
    symbol: string,
    amountToTrade: number,
    minProfitability: number,
  ) {
    const cacheKeyA = symbol + '-' + exchangeA.id;
    const cacheKeyB = symbol + '-' + exchangeB.id;
    const cachedOrderBookA = this.orderBookCache.get(cacheKeyA);
    const cachedOrderBookB = this.orderBookCache.get(cacheKeyB);

    if (
      cachedOrderBookA &&
      cachedOrderBookB &&
      this.isDataFresh(cachedOrderBookA.timestamp) &&
      this.isDataFresh(cachedOrderBookB.timestamp)
    ) {
      const vwapA = this.calculateVWAPForAmount(
        cachedOrderBookA.data,
        amountToTrade,
      );
      const vwapB = this.calculateVWAPForAmount(
        cachedOrderBookB.data,
        amountToTrade,
      );

      if ((vwapB - vwapA) / vwapA >= minProfitability) {
        this.logger.log(
          `User ${userId}, Client ${clientId}: Arbitrage opportunity for ${symbol} (VWAP): Buy on ${exchangeA.name} at ${vwapA}, sell on ${exchangeB.name} at ${vwapB}`,
        );
        // Implement trade execution logic or further analysis
      }

      if ((vwapA - vwapB) / vwapB >= minProfitability) {
        this.logger.log(
          `User ${userId}, Client ${clientId}: Arbitrage opportunity for ${symbol} (VWAP): Buy on ${exchangeB.name} at ${vwapB}, sell on ${exchangeA.name} at ${vwapA}`,
        );
        // Implement trade execution logic or further analysis
      }
    } else {
      this.logger.log(
        'Order book data is not fresh enough for reliable arbitrage calculation.',
      );
    }
  }

  private calculateVWAPForAmount(
    orderBook: ccxt.OrderBook,
    amountToTrade: number,
  ): number {
    let volumeAccumulated = 0;
    let volumePriceProductSum = 0;

    for (const [price, volume] of orderBook.asks) {
      const volumeToUse = Math.min(volume, amountToTrade - volumeAccumulated);
      volumePriceProductSum += volumeToUse * price;
      volumeAccumulated += volumeToUse;
      if (volumeAccumulated >= amountToTrade) break;
    }

    return volumeAccumulated > 0
      ? volumePriceProductSum / volumeAccumulated
      : 0;
  }

  private isDataFresh(timestamp: number): boolean {
    const freshnessThreshold = 10000; // 30 seconds
    return Date.now() - timestamp < freshnessThreshold;
  }

  private handleShutdown() {
    this.logger.log('Shutting down strategy service...');
    this.strategyInstances.forEach((instance) => {
      clearInterval(instance.intervalId);
    });
    this.strategyInstances.clear();

    this.activeOrderBookWatches.clear();

    process.exit(0);
  }
}
