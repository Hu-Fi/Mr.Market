/**
 * StrategyService
 *
 * This service manages and executes trading strategies, including arbitrage and market making.
 * It utilizes the CCXT library for interacting with cryptocurrency exchanges and provides functionality
 * for starting, stopping, and managing strategies for users.
 *
 * Dependencies:
 * - TradeService: Service for executing trades.
 * - PerformanceService: Service for recording trading performance.
 * - CustomLogger: Custom logging service for logging errors and information.
 * - Repositories: Injected repositories for managing MarketMakingHistory and ArbitrageHistory entities.
 * - DTOs: ArbitrageStrategyDto and PureMarketMakingStrategyDto for handling strategy data transfer objects.
 * - Exceptions: InternalServerErrorException for handling errors.
 * - Helpers: StrategyKey, createStrategyKey for generating strategy keys.
 * - Enums: PriceSourceType for specifying the price source type in market making.
 *
 * Methods:
 *
 * - constructor: Initializes the service with injected dependencies and sets up exchange instances.
 *
 * - initializeExchanges(): Sets up the exchange instances with the provided API keys and secrets.
 *
 * - getSupportedExchanges(): Returns a list of supported exchanges.
 *
 * - startArbitrageIfNotStarted(): Starts an arbitrage strategy if it is not already running.
 *
 * - pauseStrategyIfNotPaused(): Pauses a strategy if it is not already paused.
 *
 * - startArbitrageStrategyForUser(): Starts an arbitrage strategy for a user.
 *
 * - stopStrategyForUser(): Stops a strategy for a user and cancels all active orders.
 *
 * - watchSymbols(): Watches order books for the specified pair on two exchanges.
 *
 * - watchOrderBook(): Watches the order book for the specified pair on an exchange.
 *
 * - startMarketMakingIfNotStarted(): Starts a market making strategy if it is not already running.
 *
 * - executePureMarketMakingStrategy(): Executes a pure market making strategy.
 *
 * - manageMarketMakingOrdersWithLayers(): Manages market making orders with multiple layers.
 *
 * - adjustOrderParameters(): Adjusts order parameters to the exchange's precision.
 *
 * - cancelAllOrders(): Cancels all orders for the specified pair on an exchange.
 *
 * - getCurrentMarketPrice(): Fetches the current market price for the specified pair on an exchange.
 *
 * - getPriceSource(): Fetches the price source for the specified pair on an exchange based on the price source type.
 *
 * - evaluateArbitrageOpportunityVWAP(): Evaluates arbitrage opportunities using VWAP.
 *
 * - executeArbitrageTradeWithLimitOrders(): Executes arbitrage trades with limit orders.
 *
 * - getUserOrders(): Fetches regular orders for a specific user.
 *
 * - getUserArbitrageHistorys(): Fetches arbitrage orders for a specific user.
 *
 * - calculateVWAPForAmount(): Calculates the VWAP for a specified amount.
 *
 * - checkAndCleanFilledOrders(): Checks and cleans filled orders for a strategy.
 *
 * - isDataFresh(): Checks if the data is fresh based on a timestamp.
 *
 * - handleShutdown(): Handles the shutdown process for the service, including canceling all orders.
 *
 * - cancelAllStrategyOrders(): Cancels all orders for a strategy.
 *
 * Notes:
 * - The service uses CCXT for interacting with exchanges and handles different types of trading strategies.
 * - Error handling is implemented to log and manage errors during strategy execution and order management.
 * - The service logs all operations and ensures that strategy data is correctly recorded in the database.
 */

import * as ccxt from 'ccxt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArbitrageStrategyDto,
  PureMarketMakingStrategyDto,
} from 'src/modules/strategy/strategy.dto';
import { TradeService } from 'src/modules/trade/trade.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { PerformanceService } from '../performance/performance.service';
import { Injectable } from '@nestjs/common';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { StrategyKey, createStrategyKey } from 'src/common/helpers/strategyKey';
import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';

@Injectable()
export class StrategyService {
  private readonly logger = new CustomLogger(StrategyService.name);

  private orderBookCache = new Map<
    string,
    { data: ccxt.OrderBook; timestamp: number }
  >();
  private strategyInstances = new Map<
    string,
    { isRunning: boolean; intervalId: NodeJS.Timeout }
  >();
  private activeOrderBookWatches = new Map<string, Set<string>>(); // Tracks active watches for each strategy
  public activeOrders: Map<
    string,
    { exchange: ccxt.Exchange; orderId: string; symbol: string }[]
  > = new Map();

  constructor(
    private tradeService: TradeService,
    private performanceService: PerformanceService,
    private exchangeInitService: ExchangeInitService,
    @InjectRepository(MarketMakingHistory)
    private orderRepository: Repository<MarketMakingHistory>,
    @InjectRepository(ArbitrageHistory)
    private arbitrageHistoryRepository: Repository<ArbitrageHistory>,
    @InjectRepository(StrategyInstance)
    private strategyInstanceRepository: Repository<StrategyInstance>,
  ) {
    // process.on('SIGINT', () => this.handleShutdown());
    // process.on('SIGTERM', () => this.handleShutdown());
    // process.on('uncaughtException', () => this.handleShutdown());
  }

  async getSupportedExchanges(): Promise<string[]> {
    return this.exchangeInitService.getSupportedExchanges();
  }

  async getRunningStrategies(): Promise<StrategyInstance[]> {
    return await this.strategyInstanceRepository.find({
      where: { status: 'running' },
    });
  }
  async getAllStrategies(): Promise<StrategyInstance[]> {
    return await this.strategyInstanceRepository.find();
  }

  async getStrategyInstanceKey(strategyKey: string): Promise<StrategyInstance> {
    return await this.strategyInstanceRepository.findOne({
      where: { strategyKey },
    });
  }

  async rerunStrategy(strategyKey: string): Promise<void> {
    // Fetch the strategy instance from the database by its unique key
    const strategyInstance = await this.strategyInstanceRepository.findOne({
      where: { strategyKey },
    });

    if (!strategyInstance) {
      throw new Error(`Strategy with key ${strategyKey} not found.`);
    }

    // Check if the strategy is already running
    if (this.strategyInstances.has(strategyKey)) {
      this.logger.log(`Strategy ${strategyKey} is already running.`);
      return;
    }

    // Extract the parameters and run the strategy based on its type
    const { parameters, strategyType } = strategyInstance;
    switch (strategyType) {
      case 'arbitrage':
        await this.startArbitrageStrategyForUser(
          parameters as ArbitrageStrategyDto, // Use the saved parameters
          parameters.checkIntervalSeconds,
          parameters.maxOpenOrders,
        );
        break;
      case 'pureMarketMaking':
        await this.executePureMarketMakingStrategy(
          parameters as PureMarketMakingStrategyDto,
        );
        break;
      case 'volume':
        await this.executeVolumeStrategy(
          parameters.exchangeName,
          parameters.symbol,
          parameters.baseIncrementPercentage,
          parameters.baseIntervalTime,
          parameters.baseTradeAmount,
          parameters.numTrades,
          parameters.userId,
          parameters.clientId,
          parameters.pricePushRate,
          parameters.postOnlySide,
        );
        break;
      default:
        throw new Error(`Unknown strategy type: ${strategyType}`);
    }

    this.logger.log(`Strategy ${strategyKey} rerun successfully.`);
  }

  async startArbitrageIfNotStarted(
    strategyKey: string,
    strategyParamsDto: ArbitrageStrategyDto,
    checkIntervalSeconds: number,
    maxOpenOrders: number,
  ) {
    if (this.strategyInstances.has(strategyKey)) {
      return;
    }
    return await this.startArbitrageStrategyForUser(
      strategyParamsDto,
      checkIntervalSeconds,
      maxOpenOrders,
    );
  }

  async pauseStrategyIfNotPaused(key: StrategyKey) {
    const strategyKey = createStrategyKey(key);
    if (!this.strategyInstances.has(strategyKey)) {
      return;
    }
    return await this.stopStrategyForUser(key.user_id, key.client_id, key.type);
  }

  async startArbitrageStrategyForUser(
    strategyParamsDto: ArbitrageStrategyDto,
    checkIntervalSeconds: number,
    maxOpenOrders: number,
  ) {
    const { userId, clientId, pair, exchangeAName, exchangeBName } =
      strategyParamsDto;
    const strategyKey = createStrategyKey({
      type: 'arbitrage',
      user_id: userId,
      client_id: clientId,
    });

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.log(
        `Strategy already running for user ${userId} and client ${clientId}`,
      );
      return;
    }
    // Check if a running instance already exists
    let strategyInstance = await this.strategyInstanceRepository.findOne({
      where: { strategyKey, status: 'running' },
    });

    // If not running, either find a stopped instance to reuse or create a new one
    if (!strategyInstance) {
      strategyInstance = await this.strategyInstanceRepository.findOne({
        where: { strategyKey },
      });

      // If instance exists but was stopped, update its status
      if (strategyInstance) {
        await this.strategyInstanceRepository.update(
          { strategyKey },
          { status: 'running', updatedAt: new Date() },
        );
      } else {
        // Otherwise, create a new instance
        const exchange = this.exchangeInitService.getExchange(exchangeAName);
        strategyInstance = this.strategyInstanceRepository.create({
          strategyKey,
          userId,
          clientId,
          strategyType: 'arbitrage',
          parameters: strategyParamsDto,
          status: 'running',
          startPrice: await exchange
            .fetchTicker(pair)
            .then((ticker) => ticker.last),
        });
        await this.strategyInstanceRepository.save(strategyInstance);
      }
    }

    const exchangeA = this.exchangeInitService.getExchange(exchangeAName);
    const exchangeB = this.exchangeInitService.getExchange(exchangeBName);

    this.logger.log(
      `Starting arbitrage strategy for user ${userId}, client ${clientId}`,
    );
    // Add the pair to active watches for this strategy
    const watchSet = this.activeOrderBookWatches.get(strategyKey) || new Set();
    watchSet.add(pair);
    this.activeOrderBookWatches.set(strategyKey, watchSet);

    this.watchSymbols(exchangeA, exchangeB, pair, strategyKey);

    const intervalId = setInterval(async () => {
      const allOrdersFilled = await this.checkAndCleanFilledOrders(strategyKey);
      const currentOpenOrders = this.activeOrders.get(strategyKey)?.length || 0;

      if (allOrdersFilled && currentOpenOrders < maxOpenOrders) {
        await this.evaluateArbitrageOpportunityVWAP(
          exchangeA,
          exchangeB,
          strategyParamsDto,
        );
      } else {
        this.logger.log(
          `Waiting for open orders to fill for ${strategyKey} before evaluating new opportunities.`,
        );
      }
    }, checkIntervalSeconds * 1000); // Run every specified number of seconds

    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  async stopStrategyForUser(
    userId: string,
    clientId: string,
    strategyType?: string,
  ) {
    this.logger.log(
      `Stopping Strategy ${strategyType} for user ${userId} and client ${clientId}`,
    );

    let strategyKey;
    if (strategyType === 'arbitrage') {
      strategyKey = createStrategyKey({
        type: 'arbitrage',
        user_id: userId,
        client_id: clientId,
      });
    } else if (strategyType === 'pureMarketMaking') {
      strategyKey = createStrategyKey({
        type: 'pureMarketMaking',
        user_id: userId,
        client_id: clientId,
      });
    } else if (strategyType === 'volume') {
      strategyKey = createStrategyKey({
        type: 'volume',
        user_id: userId,
        client_id: clientId,
      });
    }

    await this.strategyInstanceRepository.update(
      { strategyKey },
      { status: 'stopped', updatedAt: new Date() },
    );

    const strategyInstance = this.strategyInstances.get(strategyKey);
    if (strategyInstance) {
      // Clear the interval
      clearInterval(strategyInstance.intervalId);
      // Cancel all orders for this strategy
      await this.cancelAllStrategyOrders(strategyKey);

      this.strategyInstances.delete(strategyKey);
      this.logger.log(
        `Stopped ${strategyType} strategy for user ${userId}, client ${clientId}`,
      );

      // Remove the pairs from active watches
      this.activeOrderBookWatches.delete(strategyKey);
    }
  }

async executeVolumeStrategy(
  exchangeName: string,
  symbol: string,
  baseIncrementPercentage: number,
  baseIntervalTime: number,
  baseTradeAmount: number,
  numTrades: number,
  userId: string,
  clientId: string,
  pricePushRate: number,
  postOnlySide: 'buy' | 'sell',
) {
  const strategyKey = createStrategyKey({
    type: 'volume',
    user_id: userId,
    client_id: clientId,
  });

  try {
    let strategyInstance = await this.strategyInstanceRepository.findOne({ where: { strategyKey } });

    const ex1 = this.exchangeInitService.getExchange(exchangeName, 'default');
    const ex2 = this.exchangeInitService.getExchange(exchangeName, 'account2');

    await Promise.all([ex1.loadMarkets(), ex2.loadMarkets()]);

    const market = ex1.market(symbol);
    if (!market) throw new Error(`Market not found for ${symbol} on ${ex1.id}`);

    const priceToPrec = (p: number) => Number(ex1.priceToPrecision(symbol, p));
    const amtToPrec = (a: number) => Number(ex1.amountToPrecision(symbol, a));

    const minAmt = market.limits?.amount?.min ?? 0;
    const minPrice = market.limits?.price?.min ?? 0;

    const startTicker = await ex1.fetchTicker(symbol);
    const startPrice = Number(startTicker.last);

    const parameters = {
      exchangeName,
      symbol,
      baseIncrementPercentage,
      baseIntervalTime,
      baseTradeAmount,
      numTrades,
      userId,
      clientId,
      pricePushRate,
      postOnlySide,
    };

    if (!strategyInstance) {
      strategyInstance = this.strategyInstanceRepository.create({
        strategyKey,
        userId,
        clientId,
        strategyType: 'volume',
        parameters,
        status: 'running',
        startPrice,
      });
      // await this.strategyInstanceRepository.save(strategyInstance);
    } else {
      await this.strategyInstanceRepository.update(
        { strategyKey },
        { status: 'running', updatedAt: new Date() },
      );
    }

    let tradesExecuted = 0;
    let totalPnL = 0; // Track cumulative PnL

    const loop = async () => {
      if (tradesExecuted >= numTrades) {
        this.logger.log(
          `Volume strategy [${strategyKey}] completed after ${numTrades} trades. ` +
          `Total PnL: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)}`
        );
        const inst = this.strategyInstances.get(strategyKey);
        if (inst?.intervalId) clearInterval(inst.intervalId);
        this.strategyInstances.delete(strategyKey);
        await this.strategyInstanceRepository.update(
          { strategyKey },
          { status: 'stopped', updatedAt: new Date() },
        );
        return;
      }

      const tradeNumber = tradesExecuted + 1;

      try {
        await Promise.all([
          this.cancelAllOrders(ex1, symbol, strategyKey),
          this.cancelAllOrders(ex2, symbol, strategyKey),
        ]);

        const [bal1, bal2] = await Promise.all([
          ex1.fetchBalance(),
          ex2.fetchBalance(),
        ]);

        const [base, quote] = symbol.split('/');

        const ex1Base = Number(bal1.free[base] ?? 0);
        const ex1Quote = Number(bal1.free[quote] ?? 0);
        const ex2Base = Number(bal2.free[base] ?? 0);
        const ex2Quote = Number(bal2.free[quote] ?? 0);

        // Use ex1 orderbook as global reference
        const book1 = await ex1.fetchOrderBook(symbol);
        const bid1 = book1.bids[0]?.[0];
        const ask1 = book1.asks[0]?.[0];
        if (!bid1 || !ask1) throw new Error('Empty orderbook on ex1');

        const globalMid = (bid1 + ask1) / 2;
        const priceForCapacity = globalMid > 0 ? globalMid : (minPrice || 1e-12);

        const makerSide: 'buy' | 'sell' = postOnlySide;
        const takerSide: 'buy' | 'sell' = makerSide === 'buy' ? 'sell' : 'buy';

        // Capacity if ex1 = maker, ex2 = taker
        const capacity1 = Math.min(
          makerSide === 'buy' ? ex1Quote / priceForCapacity : ex1Base,
          makerSide === 'buy' ? ex2Base : ex2Quote / priceForCapacity,
        );

        // Capacity if ex2 = maker, ex1 = taker
        const capacity2 = Math.min(
          makerSide === 'buy' ? ex2Quote / priceForCapacity : ex2Base,
          makerSide === 'buy' ? ex1Base : ex1Quote / priceForCapacity,
        );

        let makerEx = capacity1 >= capacity2 ? ex1 : ex2;
        let takerEx = capacity1 >= capacity2 ? ex2 : ex1;
        let maxCapacity = capacity1 >= capacity2 ? capacity1 : capacity2;

        if (!maxCapacity || maxCapacity <= 0 || maxCapacity < minAmt) {
          this.logger.warn(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: insufficient combined balance. ` +
            `ex1Base=${ex1Base.toFixed(8)} ex1Quote=${ex1Quote.toFixed(8)} ex2Base=${ex2Base.toFixed(
              8,
            )} ex2Quote=${ex2Quote.toFixed(8)}`,
          );
          return;
        }

        // Maker orderbook (reuse ex1 book if makerEx is ex1)
        const makerBook = makerEx === ex1 ? book1 : await makerEx.fetchOrderBook(symbol);
        const makerBid = makerBook.bids[0]?.[0];
        const makerAsk = makerBook.asks[0]?.[0];
        if (!makerBid || !makerAsk) throw new Error(`Empty orderbook on maker exchange ${makerEx.id}`);

        const mid = (makerBid + makerAsk) / 2;
        const makerRawPrice = Math.max(mid, minPrice || 1e-12);
        const makerPrice = priceToPrec(makerRawPrice);

        let rawAmt = Math.min(baseTradeAmount, maxCapacity) * 0.99;
        let amount = amtToPrec(rawAmt);

        if (!amount || amount <= 0 || amount < minAmt) {
          this.logger.warn(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: computed amount too small. ` +
            `amount=${amount} minAmt=${minAmt} maxCapacity=${maxCapacity}`,
          );
          return;
        }

        // Helper to recompute capacity after switching maker/taker
        const computeCapacity = (me: ccxt.Exchange, te: ccxt.Exchange) => {
          const bMaker = me === ex1 ? bal1 : bal2;
          const bTaker = te === ex1 ? bal1 : bal2;

          const mBase = Number(bMaker.free[base] ?? 0);
          const mQuote = Number(bMaker.free[quote] ?? 0);
          const tBase = Number(bTaker.free[base] ?? 0);
          const tQuote = Number(bTaker.free[quote] ?? 0);

          const mMax = makerSide === 'buy' ? mQuote / priceForCapacity : mBase;
          const tMax = makerSide === 'buy' ? tBase : tQuote / priceForCapacity;

          return Math.min(mMax, tMax);
        };

        let makerOrder: any;
        let takerOrder: any;
        let lastTakerPrice: number | undefined;

        // -----------------------
        // MAKER ORDER (with fallback)
        // -----------------------
        try {
          makerOrder = await makerEx.createOrder(
            symbol,
            'limit',
            makerSide,
            amount,
            makerPrice,
            { postOnly: true },
          );

          this.logger.log(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
            `Maker order placed: ${makerOrder.id}`
          );
        } catch (e: any) {
          this.logger.warn(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: maker failed on ${makerEx.id}: ${e.message}. ` +
            `Switching maker/taker and recomputing amount.`,
          );

          // Swap roles
          const newMaker = makerEx === ex1 ? ex2 : ex1;
          const newTaker = makerEx === ex1 ? ex1 : ex2;
          makerEx = newMaker;
          takerEx = newTaker;

          const cap = computeCapacity(makerEx, takerEx);
          if (!cap || cap <= 0 || cap < minAmt) {
            throw new Error(
              `Alternate maker/taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`,
            );
          }

          const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
          if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
            throw new Error(
              `Alternate maker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`,
            );
          }

          amount = newAmt;

          makerOrder = await makerEx.createOrder(
            symbol,
            'limit',
            makerSide,
            amount,
            makerPrice,
            { postOnly: true },
          );

          this.logger.log(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
            `Alternate maker order placed: ${makerOrder.id}`
          );
        }

        // -----------------------
        // 30ms SAFETY DELAY
        // -----------------------
        await new Promise(resolve => setTimeout(resolve, 30));

        // -----------------------
        // TAKER ORDER (LIMIT + IOC, with fallback)
        // -----------------------
        try {
          const takerLimitPrice = makerPrice;
          lastTakerPrice = takerLimitPrice + (takerLimitPrice*0.0000001);

          takerOrder = await takerEx.createOrder(
            symbol,
            'limit',
            takerSide,
            amount,
            takerLimitPrice,
            { timeInForce: 'IOC' },
          );

          this.logger.log(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
            `Taker order placed: ${takerOrder.id}`
          );
        } catch (e: any) {
          this.logger.warn(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: taker failed on ${takerEx.id}: ${e.message}. ` +
            `Switching taker and recomputing amount.`,
          );

          const newTaker = takerEx === ex1 ? ex2 : ex1;
          takerEx = newTaker;

          const cap = computeCapacity(makerEx, takerEx);
          if (!cap || cap <= 0 || cap < minAmt) {
            try {
              if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
            } catch (_) {}
            throw new Error(
              `Alternate taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`,
            );
          }

          const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
          if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
            try {
              if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
            } catch (_) {}
            throw new Error(
              `Alternate taker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`,
            );
          }

          amount = newAmt;

          const takerLimitPrice = makerPrice;
          lastTakerPrice = takerLimitPrice;

          takerOrder = await takerEx.createOrder(
            symbol,
            'limit',
            takerSide,
            amount,
            takerLimitPrice,
            { timeInForce: 'IOC' },
          );

          this.logger.log(
            `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
            `Alternate taker order placed: ${takerOrder.id}`
          );
        }

        // -----------------------
        // LOG + FILL STATUS + PNL TRACKING
        // -----------------------
        await new Promise(resolve => setTimeout(resolve, 200)); // Brief delay for order status update

        const [makerRes, takerRes] = await Promise.all([
          makerEx.fetchOrder(makerOrder.id, symbol),
          takerEx.fetchOrder(takerOrder.id, symbol),
        ]);

        const makerFilled = makerRes.filled ?? 0;
        const takerFilled = takerRes.filled ?? 0;
        const makerAvgPrice = makerRes.average ?? makerPrice;
        const takerAvgPrice = takerRes.average ?? (lastTakerPrice ?? makerPrice);

        // Calculate PnL
        let tradePnL = 0;
        if (makerFilled > 0 && takerFilled > 0) {
          const filledAmount = Math.min(makerFilled, takerFilled);
          
          if (makerSide === 'buy') {
            // We bought at makerAvgPrice and sold at takerAvgPrice
            tradePnL = (takerAvgPrice - makerAvgPrice) * filledAmount;
          } else {
            // We sold at makerAvgPrice and bought at takerAvgPrice
            tradePnL = (makerAvgPrice - takerAvgPrice) * filledAmount;
          }
          
          totalPnL += tradePnL;
        }

        this.logger.log(
          `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
          `Maker ${makerSide.toUpperCase()} ${amount} @ ${makerPrice} on ${makerEx.id} ` +
          `status=${makerRes.status} filled=${makerFilled}/${amount} avgPrice=${makerAvgPrice}`,
        );

        this.logger.log(
          `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
          `Taker ${takerSide.toUpperCase()} ${amount} @ ${lastTakerPrice ?? 'N/A'} on ${takerEx.id} ` +
          `status=${takerRes.status} filled=${takerFilled}/${amount} avgPrice=${takerAvgPrice}`,
        );

        this.logger.log(
          `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
          `PnL: ${tradePnL >= 0 ? '+' : ''}${tradePnL.toFixed(8)} ${quote} | ` +
          `Cumulative: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)} ${quote}`
        );

        tradesExecuted++;
      } catch (err: any) {
        this.logger.error(
          `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: Error in trade cycle: ${err.message}`,
        );
      }
    };

    const intervalId = setInterval(loop, Math.max(baseIntervalTime, 1) * 1000);
    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });

    this.logger.log(
      `Volume strategy [${strategyKey}] started on ${exchangeName} for ${symbol}. ` +
      `postOnlySide=${postOnlySide} numTrades=${numTrades}`,
    );
  } catch (e: any) {
    this.logger.error(`Failed to execute volume strategy [${strategyKey}]: ${e.message}`);
  }
}
// async executeVolumeStrategy(
//   exchangeName: string,
//   symbol: string,
//   baseIncrementPercentage: number,
//   baseIntervalTime: number,
//   baseTradeAmount: number,
//   numTrades: number,
//   userId: string,
//   clientId: string,
//   pricePushRate: number,
//   postOnlySide: 'buy' | 'sell',
// ) {
//   const strategyKey = createStrategyKey({
//     type: 'volume',
//     user_id: userId,
//     client_id: clientId,
//   });

//   try {
//     let strategyInstance = await this.strategyInstanceRepository.findOne({ where: { strategyKey } });

//     const ex1 = this.exchangeInitService.getExchange(exchangeName, 'default');
//     const ex2 = this.exchangeInitService.getExchange(exchangeName, 'account2');

//     await Promise.all([ex1.loadMarkets(), ex2.loadMarkets()]);

//     const market = ex1.market(symbol);
//     if (!market) throw new Error(`Market not found for ${symbol} on ${ex1.id}`);

//     const priceToPrec = (p: number) => Number(ex1.priceToPrecision(symbol, p));
//     const amtToPrec = (a: number) => Number(ex1.amountToPrecision(symbol, a));

//     const minAmt = market.limits?.amount?.min ?? 0;
//     const minPrice = market.limits?.price?.min ?? 0;

//     const startTicker = await ex1.fetchTicker(symbol);
//     const startPrice = Number(startTicker.last);

//     const parameters = {
//       exchangeName,
//       symbol,
//       baseIncrementPercentage,
//       baseIntervalTime,
//       baseTradeAmount,
//       numTrades,
//       userId,
//       clientId,
//       pricePushRate,
//       postOnlySide,
//     };

//     if (!strategyInstance) {
//       strategyInstance = this.strategyInstanceRepository.create({
//         strategyKey,
//         userId,
//         clientId,
//         strategyType: 'volume',
//         parameters,
//         status: 'running',
//         startPrice,
//       });
//       // await this.strategyInstanceRepository.save(strategyInstance);
//     } else {
//       await this.strategyInstanceRepository.update(
//         { strategyKey },
//         { status: 'running', updatedAt: new Date() },
//       );
//     }

//     let tradesExecuted = 0;
//     let totalPnL = 0; // Track cumulative PnL

//     const oppositeSide = (s: 'buy' | 'sell'): 'buy' | 'sell' => (s === 'buy' ? 'sell' : 'buy');

//     const loop = async () => {
//       if (tradesExecuted >= numTrades) {
//         this.logger.log(
//           `Volume strategy [${strategyKey}] completed after ${numTrades} trades. ` +
//             `Total PnL: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)}`,
//         );
//         const inst = this.strategyInstances.get(strategyKey);
//         if (inst?.intervalId) clearInterval(inst.intervalId);
//         this.strategyInstances.delete(strategyKey);
//         await this.strategyInstanceRepository.update(
//           { strategyKey },
//           { status: 'stopped', updatedAt: new Date() },
//         );
//         return;
//       }

//       const tradeNumber = tradesExecuted + 1;

//       try {
//         await Promise.all([
//           this.cancelAllOrders(ex1, symbol, strategyKey),
//           this.cancelAllOrders(ex2, symbol, strategyKey),
//         ]);

//         const [bal1, bal2] = await Promise.all([ex1.fetchBalance(), ex2.fetchBalance()]);

//         const [base, quote] = symbol.split('/');

//         const ex1Base = Number(bal1.free[base] ?? 0);
//         const ex1Quote = Number(bal1.free[quote] ?? 0);
//         const ex2Base = Number(bal2.free[base] ?? 0);
//         const ex2Quote = Number(bal2.free[quote] ?? 0);

//         // Use ex1 orderbook as global reference
//         const book1 = await ex1.fetchOrderBook(symbol);
//         const bid1 = book1.bids[0]?.[0];
//         const ask1 = book1.asks[0]?.[0];
//         if (!bid1 || !ask1) throw new Error('Empty orderbook on ex1');

//         const globalMid = (bid1 + ask1) / 2;
//         const priceForCapacity = globalMid > 0 ? globalMid : minPrice || 1e-12;

//         // -----------------------
//         // ALTERNATE MAKER SIDE (BUY/SELL) EACH TRADE
//         // Trade 1 => postOnlySide
//         // Trade 2 => opposite
//         // Trade 3 => postOnlySide
//         // ...
//         // -----------------------
//         const makerSide: 'buy' | 'sell' =
//           tradeNumber % 2 === 1 ? postOnlySide : oppositeSide(postOnlySide);
//         const takerSide: 'buy' | 'sell' = oppositeSide(makerSide);

//         // Capacity if ex1 = maker, ex2 = taker
//         const capacity1 = Math.min(
//           makerSide === 'buy' ? ex1Quote / priceForCapacity : ex1Base,
//           makerSide === 'buy' ? ex2Base : ex2Quote / priceForCapacity,
//         );

//         // Capacity if ex2 = maker, ex1 = taker
//         const capacity2 = Math.min(
//           makerSide === 'buy' ? ex2Quote / priceForCapacity : ex2Base,
//           makerSide === 'buy' ? ex1Base : ex1Quote / priceForCapacity,
//         );

//         let makerEx = capacity1 >= capacity2 ? ex1 : ex2;
//         let takerEx = capacity1 >= capacity2 ? ex2 : ex1;
//         let maxCapacity = capacity1 >= capacity2 ? capacity1 : capacity2;

//         if (!maxCapacity || maxCapacity <= 0 || maxCapacity < minAmt) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: insufficient combined balance. ` +
//               `ex1Base=${ex1Base.toFixed(8)} ex1Quote=${ex1Quote.toFixed(8)} ex2Base=${ex2Base.toFixed(
//                 8,
//               )} ex2Quote=${ex2Quote.toFixed(8)}`,
//           );
//           return;
//         }

//         // Maker orderbook (reuse ex1 book if makerEx is ex1)
//         const makerBook = makerEx === ex1 ? book1 : await makerEx.fetchOrderBook(symbol);
//         const makerBid = makerBook.bids[0]?.[0];
//         const makerAsk = makerBook.asks[0]?.[0];
//         if (!makerBid || !makerAsk) throw new Error(`Empty orderbook on maker exchange ${makerEx.id}`);

//         const mid = (makerBid + makerAsk) / 2;
//         const makerRawPrice = Math.max(mid, minPrice || 1e-12);
//         const makerPrice = priceToPrec(
//           makerRawPrice * (1 + Math.random() * 0.0007 * (Math.random() < 0.5 ? -1 : 1)),
//         );

//         let rawAmt = Math.min(baseTradeAmount, maxCapacity) * 0.99;
//         let amount = amtToPrec(rawAmt);

//         if (!amount || amount <= 0 || amount < minAmt) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: computed amount too small. ` +
//               `amount=${amount} minAmt=${minAmt} maxCapacity=${maxCapacity}`,
//           );
//           return;
//         }

//         // Helper to recompute capacity after switching maker/taker
//         const computeCapacity = (me: ccxt.Exchange, te: ccxt.Exchange) => {
//           const bMaker = me === ex1 ? bal1 : bal2;
//           const bTaker = te === ex1 ? bal1 : bal2;

//           const mBase = Number(bMaker.free[base] ?? 0);
//           const mQuote = Number(bMaker.free[quote] ?? 0);
//           const tBase = Number(bTaker.free[base] ?? 0);
//           const tQuote = Number(bTaker.free[quote] ?? 0);

//           const mMax = makerSide === 'buy' ? mQuote / priceForCapacity : mBase;
//           const tMax = makerSide === 'buy' ? tBase : tQuote / priceForCapacity;

//           return Math.min(mMax, tMax);
//         };

//         let makerOrder: any;
//         let takerOrder: any;
//         let lastTakerPrice: number | undefined;

//         // -----------------------
//         // MAKER ORDER (with fallback)
//         // -----------------------
//         try {
//           makerOrder = await makerEx.createOrder(symbol, 'limit', makerSide, amount, makerPrice, {
//             postOnly: true,
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Maker order placed: ${makerOrder.id}`,
//           );
//         } catch (e: any) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: maker failed on ${makerEx.id}: ${e.message}. ` +
//               `Switching maker/taker and recomputing amount.`,
//           );

//           // Swap roles
//           const newMaker = makerEx === ex1 ? ex2 : ex1;
//           const newTaker = makerEx === ex1 ? ex1 : ex2;
//           makerEx = newMaker;
//           takerEx = newTaker;

//           const cap = computeCapacity(makerEx, takerEx);
//           if (!cap || cap <= 0 || cap < minAmt) {
//             throw new Error(`Alternate maker/taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
//           if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
//             throw new Error(`Alternate maker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           amount = newAmt;

//           makerOrder = await makerEx.createOrder(symbol, 'limit', makerSide, amount, makerPrice, {
//             postOnly: true,
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Alternate maker order placed: ${makerOrder.id}`,
//           );
//         }

//         // -----------------------
//         // 30ms SAFETY DELAY
//         // -----------------------
//         await new Promise((resolve) => setTimeout(resolve, 30));

//         // -----------------------
//         // TAKER ORDER (LIMIT + IOC, with fallback)
//         // -----------------------
//         try {
//           const takerLimitPrice = makerPrice;
//           lastTakerPrice = takerLimitPrice + takerLimitPrice * 0.0001;

//           takerOrder = await takerEx.createOrder(symbol, 'limit', takerSide, amount, takerLimitPrice, {
//             timeInForce: 'IOC',
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Taker order placed: ${takerOrder.id}`,
//           );
//         } catch (e: any) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: taker failed on ${takerEx.id}: ${e.message}. ` +
//               `Switching taker and recomputing amount.`,
//           );

//           const newTaker = takerEx === ex1 ? ex2 : ex1;
//           takerEx = newTaker;

//           const cap = computeCapacity(makerEx, takerEx);
//           if (!cap || cap <= 0 || cap < minAmt) {
//             try {
//               if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
//             } catch (_) {}
//             throw new Error(`Alternate taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
//           if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
//             try {
//               if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
//             } catch (_) {}
//             throw new Error(`Alternate taker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           amount = newAmt;

//           const takerLimitPrice = makerPrice;
//           lastTakerPrice = takerLimitPrice;

//           takerOrder = await takerEx.createOrder(symbol, 'limit', takerSide, amount, takerLimitPrice, {
//             timeInForce: 'IOC',
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Alternate taker order placed: ${takerOrder.id}`,
//           );
//         }

//         // -----------------------
//         // LOG + FILL STATUS + PNL TRACKING
//         // -----------------------
//         await new Promise((resolve) => setTimeout(resolve, 200)); // Brief delay for order status update

//         const [makerRes, takerRes] = await Promise.all([
//           makerEx.fetchOrder(makerOrder.id, symbol),
//           takerEx.fetchOrder(takerOrder.id, symbol),
//         ]);

//         const makerFilled = makerRes.filled ?? 0;
//         const takerFilled = takerRes.filled ?? 0;
//         const makerAvgPrice = makerRes.average ?? makerPrice;
//         const takerAvgPrice = takerRes.average ?? (lastTakerPrice ?? makerPrice);

//         // Calculate PnL
//         let tradePnL = 0;
//         if (makerFilled > 0 && takerFilled > 0) {
//           const filledAmount = Math.min(makerFilled, takerFilled);

//           if (makerSide === 'buy') {
//             // We bought at makerAvgPrice and sold at takerAvgPrice
//             tradePnL = (takerAvgPrice - makerAvgPrice) * filledAmount;
//           } else {
//             // We sold at makerAvgPrice and bought at takerAvgPrice
//             tradePnL = (makerAvgPrice - takerAvgPrice) * filledAmount;
//           }

//           totalPnL += tradePnL;
//         }

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `Maker ${makerSide.toUpperCase()} ${amount} @ ${makerPrice} on ${makerEx.id} ` +
//             `status=${makerRes.status} filled=${makerFilled}/${amount} avgPrice=${makerAvgPrice}`,
//         );

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `Taker ${takerSide.toUpperCase()} ${amount} @ ${lastTakerPrice ?? 'N/A'} on ${takerEx.id} ` +
//             `status=${takerRes.status} filled=${takerFilled}/${amount} avgPrice=${takerAvgPrice}`,
//         );

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `PnL: ${tradePnL >= 0 ? '+' : ''}${tradePnL.toFixed(8)} ${quote} | ` +
//             `Cumulative: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)} ${quote}`,
//         );

//         tradesExecuted++;
//       } catch (err: any) {
//         this.logger.error(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: Error in trade cycle: ${err.message}`,
//         );
//       }
//     };

//     const intervalId = setInterval(loop, Math.max(baseIntervalTime, 1) * 1000);
//     this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });

//     this.logger.log(
//       `Volume strategy [${strategyKey}] started on ${exchangeName} for ${symbol}. ` +
//         `postOnlySide=${postOnlySide} numTrades=${numTrades}`,
//     );
//   } catch (e: any) {
//     this.logger.error(`Failed to execute volume strategy [${strategyKey}]: ${e.message}`);
//   }
// }
// async executeVolumeStrategy(
//   exchangeName: string,
//   symbol: string,
//   baseIncrementPercentage: number,
//   baseIntervalTime: number,
//   baseTradeAmount: number,
//   numTrades: number,
//   userId: string,
//   clientId: string,
//   pricePushRate: number,
//   postOnlySide: 'buy' | 'sell',
// ) {
//   const strategyKey = createStrategyKey({
//     type: 'volume',
//     user_id: userId,
//     client_id: clientId,
//   });

//   try {
//     let strategyInstance = await this.strategyInstanceRepository.findOne({ where: { strategyKey } });

//     const ex1 = this.exchangeInitService.getExchange(exchangeName, 'default');
//     const ex2 = this.exchangeInitService.getExchange(exchangeName, 'account2');

//     await Promise.all([ex1.loadMarkets(), ex2.loadMarkets()]);

//     const market = ex1.market(symbol);
//     if (!market) throw new Error(`Market not found for ${symbol} on ${ex1.id}`);

//     const priceToPrec = (p: number) => Number(ex1.priceToPrecision(symbol, p));
//     const amtToPrec = (a: number) => Number(ex1.amountToPrecision(symbol, a));

//     const minAmt = market.limits?.amount?.min ?? 0;
//     const minPrice = market.limits?.price?.min ?? 0;

//     const startTicker = await ex1.fetchTicker(symbol);
//     const startPrice = Number(startTicker.last);

//     const parameters = {
//       exchangeName,
//       symbol,
//       baseIncrementPercentage,
//       baseIntervalTime,
//       baseTradeAmount,
//       numTrades,
//       userId,
//       clientId,
//       pricePushRate,
//       postOnlySide,
//     };

//     if (!strategyInstance) {
//       strategyInstance = this.strategyInstanceRepository.create({
//         strategyKey,
//         userId,
//         clientId,
//         strategyType: 'volume',
//         parameters,
//         status: 'running',
//         startPrice,
//       });
//       // await this.strategyInstanceRepository.save(strategyInstance);
//     } else {
//       await this.strategyInstanceRepository.update(
//         { strategyKey },
//         { status: 'running', updatedAt: new Date() },
//       );
//     }

//     let tradesExecuted = 0;
//     let totalPnL = 0; // Track cumulative PnL

//     const oppositeSide = (s: 'buy' | 'sell'): 'buy' | 'sell' => (s === 'buy' ? 'sell' : 'buy');

//     const loop = async () => {
//       if (tradesExecuted >= numTrades) {
//         this.logger.log(
//           `Volume strategy [${strategyKey}] completed after ${numTrades} trades. ` +
//             `Total PnL: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)}`,
//         );
//         const inst = this.strategyInstances.get(strategyKey);
//         if (inst?.intervalId) clearInterval(inst.intervalId);
//         this.strategyInstances.delete(strategyKey);
//         await this.strategyInstanceRepository.update(
//           { strategyKey },
//           { status: 'stopped', updatedAt: new Date() },
//         );
//         return;
//       }

//       const tradeNumber = tradesExecuted + 1;

//       try {
//         await Promise.all([
//           this.cancelAllOrders(ex1, symbol, strategyKey),
//           this.cancelAllOrders(ex2, symbol, strategyKey),
//         ]);

//         const [bal1, bal2] = await Promise.all([ex1.fetchBalance(), ex2.fetchBalance()]);

//         const [base, quote] = symbol.split('/');

//         const ex1Base = Number(bal1.free[base] ?? 0);
//         const ex1Quote = Number(bal1.free[quote] ?? 0);
//         const ex2Base = Number(bal2.free[base] ?? 0);
//         const ex2Quote = Number(bal2.free[quote] ?? 0);

//         // Use ex1 orderbook as global reference
//         const book1 = await ex1.fetchOrderBook(symbol);
//         const bid1 = book1.bids[0]?.[0];
//         const ask1 = book1.asks[0]?.[0];
//         if (!bid1 || !ask1) throw new Error('Empty orderbook on ex1');

//         const globalMid = (bid1 + ask1) / 2;
//         const priceForCapacity = globalMid > 0 ? globalMid : minPrice || 1e-12;

//         // -----------------------
//         // ALTERNATE MAKER SIDE (BUY/SELL) EACH TRADE
//         // Trade 1 => postOnlySide
//         // Trade 2 => opposite
//         // Trade 3 => postOnlySide
//         // ...
//         // -----------------------
//         const makerSide: 'buy' | 'sell' =
//           tradeNumber % 2 === 1 ? postOnlySide : oppositeSide(postOnlySide);
//         const takerSide: 'buy' | 'sell' = oppositeSide(makerSide);

//         // Capacity if ex1 = maker, ex2 = taker
//         const capacity1 = Math.min(
//           makerSide === 'buy' ? ex1Quote / priceForCapacity : ex1Base,
//           makerSide === 'buy' ? ex2Base : ex2Quote / priceForCapacity,
//         );

//         // Capacity if ex2 = maker, ex1 = taker
//         const capacity2 = Math.min(
//           makerSide === 'buy' ? ex2Quote / priceForCapacity : ex2Base,
//           makerSide === 'buy' ? ex1Base : ex1Quote / priceForCapacity,
//         );

//         let makerEx = capacity1 >= capacity2 ? ex1 : ex2;
//         let takerEx = capacity1 >= capacity2 ? ex2 : ex1;
//         let maxCapacity = capacity1 >= capacity2 ? capacity1 : capacity2;

//         if (!maxCapacity || maxCapacity <= 0 || maxCapacity < minAmt) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: insufficient combined balance. ` +
//               `ex1Base=${ex1Base.toFixed(8)} ex1Quote=${ex1Quote.toFixed(8)} ex2Base=${ex2Base.toFixed(
//                 8,
//               )} ex2Quote=${ex2Quote.toFixed(8)}`,
//           );
//           return;
//         }

//         // Maker orderbook (reuse ex1 book if makerEx is ex1)
//         const makerBook = makerEx === ex1 ? book1 : await makerEx.fetchOrderBook(symbol);
//         const makerBid = makerBook.bids[0]?.[0];
//         const makerAsk = makerBook.asks[0]?.[0];
//         if (!makerBid || !makerAsk) throw new Error(`Empty orderbook on maker exchange ${makerEx.id}`);

//         // -----------------------
//         // MAKER PRICE: within 7% of spread, excluding 2%
//         // - BUY: top 15% of spread, excluding top 5% (near ask)
//         // - SELL: bottom 15% of spread, excluding bottom 5% (near bid)
//         // -----------------------
//         const spread = makerAsk - makerBid;
//         const segPct = 0.15;
//         const exclPct = 0.5;

//         const safeMinP = minPrice || 1e-12;

//         let makerRawPrice: number;
//         if (!spread || spread <= 0) {
//           const mid = (makerBid + makerAsk) / 2;
//           makerRawPrice = Math.max(mid, safeMinP);
//         } else {
//           if (makerSide === 'buy') {
//             const low = makerAsk - spread * segPct;  // ask - 7%
//             const high = makerAsk - spread * exclPct; // ask - 2%
//             makerRawPrice = low + Math.random() * (high - low);
//           } else {
//             const low = makerBid + spread * exclPct; // bid + 2%
//             const high = makerBid + spread * segPct; // bid + 7%
//             makerRawPrice = low + Math.random() * (high - low);
//           }
//           makerRawPrice = Math.max(makerRawPrice, safeMinP);
//         }

//         const makerPrice = priceToPrec(makerRawPrice);

//         let rawAmt = Math.min(baseTradeAmount, maxCapacity) * 0.99;
//         let amount = amtToPrec(rawAmt);

//         if (!amount || amount <= 0 || amount < minAmt) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: computed amount too small. ` +
//               `amount=${amount} minAmt=${minAmt} maxCapacity=${maxCapacity}`,
//           );
//           return;
//         }

//         // Helper to recompute capacity after switching maker/taker
//         const computeCapacity = (me: ccxt.Exchange, te: ccxt.Exchange) => {
//           const bMaker = me === ex1 ? bal1 : bal2;
//           const bTaker = te === ex1 ? bal1 : bal2;

//           const mBase = Number(bMaker.free[base] ?? 0);
//           const mQuote = Number(bMaker.free[quote] ?? 0);
//           const tBase = Number(bTaker.free[base] ?? 0);
//           const tQuote = Number(bTaker.free[quote] ?? 0);

//           const mMax = makerSide === 'buy' ? mQuote / priceForCapacity : mBase;
//           const tMax = makerSide === 'buy' ? tBase : tQuote / priceForCapacity;

//           return Math.min(mMax, tMax);
//         };

//         let makerOrder: any;
//         let takerOrder: any;
//         let lastTakerPrice: number | undefined;

//         // -----------------------
//         // MAKER ORDER (with fallback)
//         // -----------------------
//         try {
//           makerOrder = await makerEx.createOrder(symbol, 'limit', makerSide, amount, makerPrice, {
//             postOnly: true,
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Maker order placed: ${makerOrder.id}`,
//           );
//         } catch (e: any) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: maker failed on ${makerEx.id}: ${e.message}. ` +
//               `Switching maker/taker and recomputing amount.`,
//           );

//           // Swap roles
//           const newMaker = makerEx === ex1 ? ex2 : ex1;
//           const newTaker = makerEx === ex1 ? ex1 : ex2;
//           makerEx = newMaker;
//           takerEx = newTaker;

//           const cap = computeCapacity(makerEx, takerEx);
//           if (!cap || cap <= 0 || cap < minAmt) {
//             throw new Error(`Alternate maker/taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
//           if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
//             throw new Error(`Alternate maker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           amount = newAmt;

//           makerOrder = await makerEx.createOrder(symbol, 'limit', makerSide, amount, makerPrice, {
//             postOnly: true,
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Alternate maker order placed: ${makerOrder.id}`,
//           );
//         }

//         // -----------------------
//         // 30ms SAFETY DELAY
//         // -----------------------
//         await new Promise((resolve) => setTimeout(resolve, 30));

//         // -----------------------
//         // TAKER ORDER (LIMIT + IOC, with fallback)
//         // -----------------------
//         try {
//           const takerLimitPrice = makerPrice;
//           lastTakerPrice = takerLimitPrice + takerLimitPrice * 0.0001;

//           takerOrder = await takerEx.createOrder(symbol, 'limit', takerSide, amount, takerLimitPrice, {
//             timeInForce: 'IOC',
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Taker order placed: ${takerOrder.id}`,
//           );
//         } catch (e: any) {
//           this.logger.warn(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: taker failed on ${takerEx.id}: ${e.message}. ` +
//               `Switching taker and recomputing amount.`,
//           );

//           const newTaker = takerEx === ex1 ? ex2 : ex1;
//           takerEx = newTaker;

//           const cap = computeCapacity(makerEx, takerEx);
//           if (!cap || cap <= 0 || cap < minAmt) {
//             try {
//               if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
//             } catch (_) {}
//             throw new Error(`Alternate taker insufficient balance for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           const newAmt = amtToPrec(Math.min(baseTradeAmount, cap));
//           if (!newAmt || newAmt <= 0 || newAmt < minAmt) {
//             try {
//               if (makerOrder?.id) await makerEx.cancelOrder(makerOrder.id, symbol);
//             } catch (_) {}
//             throw new Error(`Alternate taker amount below minAmt for Trade ${tradeNumber} / ${numTrades}`);
//           }

//           amount = newAmt;

//           const takerLimitPrice = makerPrice;
//           lastTakerPrice = takerLimitPrice;

//           takerOrder = await takerEx.createOrder(symbol, 'limit', takerSide, amount, takerLimitPrice, {
//             timeInForce: 'IOC',
//           });

//           this.logger.log(
//             `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` + `Alternate taker order placed: ${takerOrder.id}`,
//           );
//         }

//         // -----------------------
//         // LOG + FILL STATUS + PNL TRACKING
//         // -----------------------
//         await new Promise((resolve) => setTimeout(resolve, 200)); // Brief delay for order status update

//         const [makerRes, takerRes] = await Promise.all([
//           makerEx.fetchOrder(makerOrder.id, symbol),
//           takerEx.fetchOrder(takerOrder.id, symbol),
//         ]);

//         const makerFilled = makerRes.filled ?? 0;
//         const takerFilled = takerRes.filled ?? 0;
//         const makerAvgPrice = makerRes.average ?? makerPrice;
//         const takerAvgPrice = takerRes.average ?? (lastTakerPrice ?? makerPrice);

//         // Calculate PnL
//         let tradePnL = 0;
//         if (makerFilled > 0 && takerFilled > 0) {
//           const filledAmount = Math.min(makerFilled, takerFilled);

//           if (makerSide === 'buy') {
//             // We bought at makerAvgPrice and sold at takerAvgPrice
//             tradePnL = (takerAvgPrice - makerAvgPrice) * filledAmount;
//           } else {
//             // We sold at makerAvgPrice and bought at takerAvgPrice
//             tradePnL = (makerAvgPrice - takerAvgPrice) * filledAmount;
//           }

//           totalPnL += tradePnL;
//         }

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `Maker ${makerSide.toUpperCase()} ${amount} @ ${makerPrice} on ${makerEx.id} ` +
//             `status=${makerRes.status} filled=${makerFilled}/${amount} avgPrice=${makerAvgPrice}`,
//         );

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `Taker ${takerSide.toUpperCase()} ${amount} @ ${lastTakerPrice ?? 'N/A'} on ${takerEx.id} ` +
//             `status=${takerRes.status} filled=${takerFilled}/${amount} avgPrice=${takerAvgPrice}`,
//         );

//         this.logger.log(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: ` +
//             `PnL: ${tradePnL >= 0 ? '+' : ''}${tradePnL.toFixed(8)} ${quote} | ` +
//             `Cumulative: ${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(8)} ${quote}`,
//         );

//         tradesExecuted++;
//       } catch (err: any) {
//         this.logger.error(
//           `[${strategyKey}] Trade ${tradeNumber} / ${numTrades}: Error in trade cycle: ${err.message}`,
//         );
//       }
//     };

//     const intervalId = setInterval(loop, Math.max(baseIntervalTime, 1) * 1000);
//     this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });

//     this.logger.log(
//       `Volume strategy [${strategyKey}] started on ${exchangeName} for ${symbol}. ` +
//         `postOnlySide=${postOnlySide} numTrades=${numTrades}`,
//     );
//   } catch (e: any) {
//     this.logger.error(`Failed to execute volume strategy [${strategyKey}]: ${e.message}`);
//   }
// }



  /**
   * Cancel leftover orders for a given exchange, symbol, and strategyKey.
   */pm2 
  private async cancelAllOrders(
    exchange: ccxt.Exchange,
    pair: string,
    strategyKey: string,
  ) {
    this.logger.log(
      `Canceling leftover orders for [${strategyKey}] on ${exchange.id}`,
    );

    try {
      const orders = await exchange.fetchOpenOrders(pair);
      for (const order of orders) {
        try {
          await exchange.cancelOrder(order.id, pair);
          // Optionally update DB if you're tracking orders by strategy
          await this.orderRepository.update(
            {
              orderId: order.id,
              exchange: exchange.id,
              pair,
              strategy: strategyKey, // or "volume" if you store by strategy name
            },
            {
              status: 'canceled',
            },
          );
        } catch (error) {
          this.logger.error(
            `Failed to cancel order ${order.id} on ${exchange.id}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error fetching open orders for ${pair} on ${exchange.id}: ${error.message}`,
      );
    }
  }

  private async waitForOrderFill(
    exchange: ccxt.Exchange,
    orderId: string,
    symbol: string,
  ) {
    let order = await exchange.fetchOrder(orderId, symbol);
    while (order.status !== 'closed' && order.status !== 'filled') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      order = await exchange.fetchOrder(orderId, symbol);
    }
  }
stopVolumeStrategy(userId: string, clientId: string) {
  const strategyKey = createStrategyKey({
    type: 'volume',
    user_id: userId,
    client_id: clientId,
  });
  const inst = this.strategyInstances.get(strategyKey);

  if (inst?.intervalId) {
    clearInterval(inst.intervalId);
  }

  this.strategyInstances.delete(strategyKey);

  this.strategyInstanceRepository
    .update({ strategyKey }, { status: 'stopped', updatedAt: new Date() })
    .then(() => this.logger.log(`Volume strategy ${strategyKey} stopped.`))
    .catch((e) => this.logger.error(`Failed to mark ${strategyKey} stopped: ${e.message}`));

  this.cancelAllStrategyOrders(strategyKey).catch((e) =>
    this.logger.error(`Failed canceling orders for ${strategyKey}: ${e.message}`),
  );
}

  private async watchSymbols(
    exchangeA: ccxt.Exchange,
    exchangeB: ccxt.Exchange,
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
      } catch (error) {
        this.logger.error(
          `Error in watchOrderBook for ${symbol} on ${exchange.id}: ${error.message}`,
        );
        // Decide on a retry mechanism or skip to the next cycle
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying or moving on
      }
    }
  }

  async startMarketMakingIfNotStarted(
    strategyKey: string,
    strategyParamsDto: PureMarketMakingStrategyDto,
  ) {
    if (this.strategyInstances.has(strategyKey)) {
      return;
    }
    return await this.executePureMarketMakingStrategy(strategyParamsDto);
  }

  async executePureMarketMakingStrategy(
    strategyParamsDto: PureMarketMakingStrategyDto,
  ) {
    const {
      userId,
      clientId,
      pair,
      exchangeName,
      oracleExchangeName, // <-- New optional param
      bidSpread,
      askSpread,
      orderAmount,
      orderRefreshTime,
      numberOfLayers,
      priceSourceType,
      amountChangePerLayer,
      amountChangeType,
      ceilingPrice,
      floorPrice,
    } = strategyParamsDto;

    const strategyKey = createStrategyKey({
      type: 'pureMarketMaking',
      user_id: userId,
      client_id: clientId,
    });

    // Ensure the strategy is not already running
    if (this.strategyInstances.has(strategyKey)) {
      this.logger.error(`Strategy ${strategyKey} is already running.`);
      return;
    }

    // Find or create the strategy instance
    let strategyInstance = await this.strategyInstanceRepository.findOne({
      where: { strategyKey, status: 'running' },
    });

    if (!strategyInstance) {
      strategyInstance = await this.strategyInstanceRepository.findOne({
        where: { strategyKey },
      });

      if (strategyInstance) {
        await this.strategyInstanceRepository.update(
          { strategyKey },
          { status: 'running', updatedAt: new Date() },
        );
      } else {
        // The exchange we place orders on
        const executionExchange =
          this.exchangeInitService.getExchange(exchangeName);

        strategyInstance = this.strategyInstanceRepository.create({
          strategyKey,
          userId,
          clientId,
          strategyType: 'pureMarketMaking',
          parameters: strategyParamsDto,
          status: 'running',
          // For startPrice, we fetch from the oracle exchange if provided, else the executionExchange
          startPrice: await (async () => {
            const priceExchange = oracleExchangeName
              ? this.exchangeInitService.getExchange(oracleExchangeName)
              : executionExchange;
            const ticker = await priceExchange.fetchTicker(pair);
            return ticker.last;
          })(),
        });
        // await this.strategyInstanceRepository.save(strategyInstance);
      }
    }

    // Start the strategy
    this.logger.log(`Starting pure market making strategy for ${strategyKey}.`);
    const intervalId = setInterval(async () => {
      try {
        await this.manageMarketMakingOrdersWithLayers(
          userId,
          clientId,
          exchangeName, // We'll still execute trades on 'exchangeName'
          pair,
          bidSpread,
          askSpread,
          orderAmount,
          numberOfLayers,
          priceSourceType,
          amountChangePerLayer,
          amountChangeType,
          ceilingPrice,
          floorPrice,
          oracleExchangeName, // Pass along to retrieve price from a different exchange if provided
        );
      } catch (error) {
        this.logger.error(
          `Error executing pure market making strategy for ${strategyKey}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }, orderRefreshTime);

    // Track the strategy instance
    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  private async manageMarketMakingOrdersWithLayers(
    userId: string,
    clientId: string,
    executionExchangeName: string,
    pair: string,
    bidSpread: number,
    askSpread: number,
    baseOrderAmount: number,
    numberOfLayers: number,
    priceSourceType: PriceSourceType,
    amountChangePerLayer: number,
    amountChangeType: 'fixed' | 'percentage',
    ceilingPrice?: number,
    floorPrice?: number,
    oracleExchangeName?: string, // optional
  ) {
    // 1. Determine which exchange to use for pricing
    const priceExchange = oracleExchangeName
      ? this.exchangeInitService.getExchange(oracleExchangeName)
      : this.exchangeInitService.getExchange(executionExchangeName);

    // 2. Execution exchange is always the main exchangeName
    const executionExchange = this.exchangeInitService.getExchange(
      executionExchangeName,
    );

    // 3. Fetch the current market price from the selected price exchange
    const priceSource = await this.getPriceSource(
      priceExchange.id, // use priceExchange for data
      pair,
      priceSourceType,
    );

    // 4. Cancel all existing orders on the execution exchange, but still use the same strategyKey
    await this.cancelAllOrders(
      executionExchange,
      pair,
      createStrategyKey({
        type: 'pureMarketMaking',
        user_id: userId,
        client_id: clientId,
      }),
    );

    // Mark all open orders not canceled as closed in DB
    await this.orderRepository.update(
      {
        userId,
        clientId,
        exchange: executionExchangeName,
        pair,
        strategy: 'pureMarketMaking',
        status: 'open',
      },
      {
        status: 'closed',
      },
    );

    let currentOrderAmount = baseOrderAmount;

    for (let layer = 1; layer <= numberOfLayers; layer++) {
      if (layer > 1) {
        if (amountChangeType === 'fixed') {
          currentOrderAmount += amountChangePerLayer;
        } else if (amountChangeType === 'percentage') {
          currentOrderAmount +=
            currentOrderAmount * (amountChangePerLayer / 100);
        }
      }

      const layerBidSpreadPercentage = bidSpread * layer;
      const layerAskSpreadPercentage = askSpread * layer;

      const buyPrice = priceSource * (1 - layerBidSpreadPercentage);
      const sellPrice = priceSource * (1 + layerAskSpreadPercentage);

      // 5. Place buy orders on the execution exchange, if below the ceiling
      if (ceilingPrice === undefined || priceSource <= ceilingPrice) {
        const {
          adjustedAmount: adjustedBuyAmount,
          adjustedPrice: adjustedBuyPrice,
        } = await this.adjustOrderParameters(
          executionExchange,
          pair,
          currentOrderAmount,
          buyPrice,
        );
        if (!adjustedBuyAmount || !adjustedBuyPrice) {
          throw new Error(
            `Invalid order parameters: amount=${adjustedBuyAmount}, price=${adjustedBuyPrice}`,
          );
        }

        const order = await this.tradeService.executeLimitTrade({
          userId,
          clientId,
          exchange: executionExchangeName,
          symbol: pair,
          side: 'buy',
          amount: parseFloat(adjustedBuyAmount),
          price: parseFloat(adjustedBuyPrice),
        });

        // Persist
        const orderEntity = this.orderRepository.create({
          userId,
          clientId,
          exchange: executionExchangeName,
          pair,
          side: 'buy',
          amount: parseFloat(adjustedBuyAmount),
          price: parseFloat(adjustedBuyPrice),
          orderId: order.id,
          executedAt: new Date(),
          status: 'open',
          strategy: 'pureMarketMaking',
        });
        await this.orderRepository.save(orderEntity);
      } else {
        this.logger.log(
          `Skipping buy order for ${pair} as price source ${priceSource} exceeds ceiling ${ceilingPrice}.`,
        );
      }

      // 6. Place sell orders on the execution exchange, if above the floor
      if (floorPrice === undefined || priceSource >= floorPrice) {
        const {
          adjustedAmount: adjustedSellAmount,
          adjustedPrice: adjustedSellPrice,
        } = await this.adjustOrderParameters(
          executionExchange,
          pair,
          currentOrderAmount,
          sellPrice,
        );

        const order = await this.tradeService.executeLimitTrade({
          userId,
          clientId,
          exchange: executionExchangeName,
          symbol: pair,
          side: 'sell',
          amount: parseFloat(adjustedSellAmount),
          price: parseFloat(adjustedSellPrice),
        });

        const orderEntity = this.orderRepository.create({
          userId,
          clientId,
          exchange: executionExchangeName,
          pair,
          side: 'sell',
          amount: parseFloat(adjustedSellAmount),
          price: parseFloat(adjustedSellPrice),
          orderId: order.id,
          executedAt: new Date(),
          status: 'open',
          strategy: 'pureMarketMaking',
        });
        await this.orderRepository.save(orderEntity);
      } else {
        this.logger.log(
          `Skipping sell order for ${pair} as price source ${priceSource} is below floor ${floorPrice}.`,
        );
      }
    }
  }


  private async adjustOrderParameters(
    exchange: ccxt.Exchange,
    symbol: string,
    amount: number,
    price: number,
  ): Promise<{ adjustedAmount: string; adjustedPrice: string }> {
    // Ensure market data is loaded
    if (!exchange.markets) {
      throw new Error('Exchange markets not loaded');
    }

    // Adjust amount and price to the exchange's precision
    const adjustedAmount = await exchange.amountToPrecision(symbol, amount);
    const adjustedPrice = await exchange.priceToPrecision(symbol, price);
    this.logger.log(`Adjusted Order: ${adjustedAmount} @ ${adjustedPrice}`);
    return { adjustedAmount, adjustedPrice };
  }

  private async getCurrentMarketPrice(
    exchangeName: string,
    pair: string,
  ): Promise<number> {
    const exchange = this.exchangeInitService.getExchange(exchangeName);
    const ticker = await exchange.fetchTicker(pair);
    return ticker.last; // Using the last trade price as the current price
  }

  private async getPriceSource(
    exchangeName: string,
    pair: string,
    priceSourceType: PriceSourceType,
  ): Promise<number> {
    const exchange = this.exchangeInitService.getExchange(exchangeName);
    const orderBook = await exchange.fetchOrderBook(pair);
    switch (priceSourceType) {
      case PriceSourceType.MID_PRICE:
        return (orderBook.bids[0][0] + orderBook.asks[0][0]) / 2;
      case PriceSourceType.BEST_ASK:
        return orderBook.asks[0][0];
      case PriceSourceType.BEST_BID:
        return orderBook.bids[0][0];
      case PriceSourceType.LAST_PRICE:
        const ticker = await exchange.fetchTicker(pair);
        return ticker.last;
      default:
        throw new Error(`Invalid price source type: ${priceSourceType}`);
    }
  }

  public async evaluateArbitrageOpportunityVWAP(
    exchangeA: ccxt.Exchange,
    exchangeB: ccxt.Exchange,
    strategyParamsDto: ArbitrageStrategyDto,
  ) {
    const { userId, clientId, pair, amountToTrade, minProfitability } =
      strategyParamsDto;
    const cacheKeyA = `${pair}-${exchangeA.id}`;
    const cacheKeyB = `${pair}-${exchangeB.id}`;
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
        'buy',
      );
      const vwapB = this.calculateVWAPForAmount(
        cachedOrderBookB.data,
        amountToTrade,
        'sell',
      );

      if ((vwapB - vwapA) / vwapA >= minProfitability) {
        // Execute trades
        this.logger.log(
          `User ${userId}, Client ${clientId}: Arbitrage opportunity for ${pair} (VWAP): Buy on ${exchangeA.name} at ${vwapA}, sell on ${exchangeB.name} at ${vwapB}`,
        );
        await this.executeArbitrageTradeWithLimitOrders(
          exchangeA,
          exchangeB,
          pair,
          amountToTrade,
          userId,
          clientId,
          vwapA,
          vwapB,
        );
      } else if ((vwapA - vwapB) / vwapB >= minProfitability) {
        // Execute trades in reverse direction
        this.logger.log(
          `User ${userId}, Client ${clientId}: Arbitrage opportunity for ${pair} (VWAP): Buy on ${exchangeB.name} at ${vwapB}, sell on ${exchangeA.name} at ${vwapA}`,
        );
        await this.executeArbitrageTradeWithLimitOrders(
          exchangeB,
          exchangeA,
          pair,
          amountToTrade,
          userId,
          clientId,
          vwapB,
          vwapA,
        );
      }
    } else {
      this.logger.log(
        'Order book data is not fresh enough for reliable arbitrage calculation.',
      );
    }
  }

  private async executeArbitrageTradeWithLimitOrders(
    exchangeA: ccxt.Exchange,
    exchangeB: ccxt.Exchange,
    symbol: string,
    amount: number,
    userId: string,
    clientId: string,
    buyPrice: number,
    sellPrice: number,
  ) {
    const strategyKey = createStrategyKey({
      type: 'arbitrage',
      user_id: userId,
      client_id: clientId,
    });
    try {
      // Place buy limit order on Exchange A
      const buyOrder = await this.tradeService.executeLimitTrade({
        userId,
        clientId,
        exchange: exchangeA.id,
        symbol,
        side: 'buy',
        amount,
        price: buyPrice,
      });
      // Track the order with the symbol
      const orderADetails = {
        exchange: exchangeA,
        orderId: buyOrder.id,
        symbol,
      };
      this.activeOrders.set(strategyKey, [
        ...(this.activeOrders.get(strategyKey) || []),
        orderADetails,
      ]);

      // Proceed to place sell limit order on Exchange B
      const sellOrder = await this.tradeService.executeLimitTrade({
        userId,
        clientId,
        exchange: exchangeB.id,
        symbol,
        side: 'sell',
        amount,
        price: sellPrice,
      });
      // Track the order with the symbol
      const orderBDetails = {
        exchange: exchangeB,
        orderId: sellOrder.id,
        symbol,
      };
      this.activeOrders.set(strategyKey, [
        ...(this.activeOrders.get(strategyKey) || []),
        orderBDetails,
      ]);

      // Calculate fees for both orders
      // This example assumes fees are returned with the order info and are in the quote currency
      const buyFee = buyOrder.fee ? buyOrder.fee.cost : 0; // Adjust based on your fee structure
      const sellFee = sellOrder.fee ? sellOrder.fee.cost : 0;

      // Calculate profit/loss, adjusting for fees
      const profitLoss =
        sellPrice * amount - sellFee - (buyPrice * amount + buyFee);

      // Save the arbitrage order details
      const arbitrageOrder = this.arbitrageHistoryRepository.create({
        userId,
        clientId,
        pair: symbol,
        exchangeAName: exchangeA.name,
        exchangeBName: exchangeB.name,
        amount,
        buyPrice,
        sellPrice,
        profit: profitLoss,
        executedAt: new Date(),
      });

      await this.arbitrageHistoryRepository.save(arbitrageOrder);
      // Log and record the trade execution and performance
      this.logger.log(
        `Arbitrage trade executed with limit orders for user ${userId}, client ${clientId}: Buy on ${exchangeA.id} at ${buyPrice}, sell on ${exchangeB.id} at ${sellPrice}, Profit/Loss: ${profitLoss}`,
      );

      await this.performanceService.recordPerformance({
        userId,
        clientId,
        strategyType: 'arbitrage',
        profitLoss,
        additionalMetrics: {
          buyExchange: exchangeA.id,
          sellExchange: exchangeB.id,
          buyPrice,
          sellPrice,
          executedAmount: amount,
          buyOrderId: buyOrder.id,
          sellOrderId: sellOrder.id,
          buyFee,
          sellFee,
        },
        executedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to execute arbitrage trade with limit orders: ${error.message}`,
      );
    }
  }

  // Fetch regular orders for a specific user
  async getUserOrders(userId: string): Promise<MarketMakingHistory[]> {
    return await this.orderRepository.find({
      where: { userId },
    });
  }

  // Fetch arbitrage orders for a specific user
  async getUserArbitrageHistorys(userId: string): Promise<ArbitrageHistory[]> {
    return await this.arbitrageHistoryRepository.find({
      where: { userId },
    });
  }

  private calculateVWAPForAmount(
    orderBook: ccxt.OrderBook,
    amountToTrade: number,
    direction: 'buy' | 'sell',
  ): number {
    let volumeAccumulated = 0;
    let volumePriceProductSum = 0;
    let orderList = [];

    // Determine whether to use asks or bids based on the trade direction
    if (direction === 'buy') {
      // When buying, we look at the asks as we want to know the price we'll buy at
      orderList = orderBook.asks;
    } else if (direction === 'sell') {
      // When selling, we look at the bids as we want to know the price we'll sell at
      orderList = orderBook.bids;
    }

    for (const [price, volume] of orderList) {
      const volumeToUse = Math.min(volume, amountToTrade - volumeAccumulated);
      volumePriceProductSum += volumeToUse * price;
      volumeAccumulated += volumeToUse;
      if (volumeAccumulated >= amountToTrade) break;
    }

    return volumeAccumulated > 0
      ? volumePriceProductSum / volumeAccumulated
      : 0;
  }

  public async checkAndCleanFilledOrders(
    strategyKey: string,
  ): Promise<boolean> {
    const activeOrdersForStrategy = this.activeOrders.get(strategyKey) || [];
    let allOrdersFilled = true; // Assume all orders are filled initially

    for (let i = 0; i < activeOrdersForStrategy.length; i++) {
      const { exchange, orderId, symbol } = activeOrdersForStrategy[i];
      try {
        const order = await exchange.fetchOrder(orderId, symbol);
        if (order.status !== 'closed' && order.status !== 'filled') {
          allOrdersFilled = false; // Found an order that's not filled
          break; // No need to check further
        }
      } catch (error) {
        this.logger.error(
          `Error checking order status for ${orderId} on ${exchange.id}: ${error.message}`,
        );
        allOrdersFilled = false; // Error occurred, assume not all orders are filled
        break; // Exit the loop
      }
    }

    // If all orders are filled, clean them up from the tracking list
    if (allOrdersFilled) {
      this.activeOrders.delete(strategyKey); // All orders for this strategy are filled, so remove them from tracking
    }

    return allOrdersFilled;
  }

  private isDataFresh(timestamp: number): boolean {
    const freshnessThreshold = 10000; // 10 seconds
    return Date.now() - timestamp < freshnessThreshold;
  }

  private async handleShutdown() {
    this.logger.log('Shutting down strategy service...');

    // Update all currently running strategies in the database to "stopped"
    await this.strategyInstanceRepository.update(
      { status: 'running' },
      { status: 'stopped', updatedAt: new Date() },
    );

    // Cancel all orders and clear intervals for each strategy
    this.strategyInstances.forEach((_, strategyKey) => {
      this.cancelAllStrategyOrders(strategyKey)
        .then(() => {
          this.logger.log(`All orders canceled for ${strategyKey}`);
        })
        .catch((error) => {
          this.logger.error(
            `Failed to cancel orders for ${strategyKey}: ${error.message}`,
          );
        });
    });

    this.strategyInstances.forEach((instance) => {
      clearInterval(instance.intervalId);
    });
    this.strategyInstances.clear();
    this.activeOrderBookWatches.clear();

    process.exit(0);
  }

  private async cancelAllStrategyOrders(strategyKey: string) {
    try {
      // Retrieve the strategy instance from the database based on the strategyKey
      const strategyInstance = await this.strategyInstanceRepository.findOne({
        where: { strategyKey },
      });

      if (!strategyInstance) {
        this.logger.warn(`Strategy with key ${strategyKey} not found.`);
        return;
      }

      // Extract relevant parameters based on strategy type
      const { strategyType, parameters } = strategyInstance;

      const exchanges: { exchangeName: string; pair: string }[] = [];

      switch (strategyType) {
        case 'arbitrage':
          // Arbitrage has two exchanges, so we add both
          exchanges.push({
            exchangeName: parameters.exchangeAName,
            pair: parameters.pair,
          });
          exchanges.push({
            exchangeName: parameters.exchangeBName,
            pair: parameters.pair,
          });
          break;
        case 'pureMarketMaking':
          exchanges.push({
            exchangeName: parameters.exchangeName,
            pair: parameters.pair,
          });
          break;
        case 'volume':
          exchanges.push({
            exchangeName: parameters.exchangeName,
            pair: parameters.symbol,
          });
          break;
        default:
          throw new Error(`Unknown strategy type: ${strategyType}`);
      }

      // Loop through each exchange and call cancelAllOrders
      for (const { exchangeName, pair } of exchanges) {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange && pair) {
          await this.cancelAllOrders(exchange, pair, strategyKey);
          this.logger.log(
            `Cancelled all orders for ${strategyKey} on ${exchangeName} (${pair})`,
          );
        } else {
          this.logger.warn(
            `Exchange or pair not found for strategy ${strategyKey} on ${exchangeName}.`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to cancel orders for strategy ${strategyKey}: ${error.message}`,
      );
    }
  }
}
