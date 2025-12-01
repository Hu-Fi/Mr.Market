import * as ccxt from 'ccxt';
import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { ExchangeInitService } from 'src/modules/infrastructure/exchange-init/exchange-init.service';
import { ArbitrageStrategyDto } from 'src/modules/market-making/strategy/strategy.dto';
import { Repository } from 'typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createStrategyKey } from 'src/common/helpers/strategyKey';
import { StrategyService } from './strategy.service';

//This is still in testing: Do not use in production

@Injectable()
export class AlpacaStratService {
  private readonly logger = new CustomLogger(AlpacaStratService.name);
  private strategyInstances = new Map<
    string,
    { isRunning: boolean; intervalId: NodeJS.Timeout }
  >();
  private activeOrders = new Map<
    string,
    { exchange: ccxt.Exchange; orderId: string; symbol: string }[]
  >();

  constructor(
    private exchangeInitService: ExchangeInitService,
    private strategyService: StrategyService,
    @InjectRepository(MarketMakingHistory)
    private orderRepository: Repository<MarketMakingHistory>,
    @InjectRepository(ArbitrageHistory)
    private arbitrageHistoryRepository: Repository<ArbitrageHistory>,
  ) {}

  // Method to start an arbitrage strategy between Alpaca and another exchange
  async startAlpacaArbitrageStrategy(
    strategyParamsDto: ArbitrageStrategyDto,
    checkIntervalSeconds: number,
    maxOpenOrders: number,
  ) {
    const { userId, clientId, pair, exchangeBName } = strategyParamsDto;
    const strategyKey = createStrategyKey({
      type: 'alpaca-arbitrage',
      user_id: userId,
      client_id: clientId,
    });

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.log(
        `Alpaca strategy for user ${userId}, client ${clientId} for ${pair} is already running.`,
      );
      return;
    }

    const alpacaExchange = this.exchangeInitService.getExchange(
      'alpaca',
      'default',
    );
    const exchangeB = this.exchangeInitService.getExchange(exchangeBName);

    this.logger.log(
      `Starting Alpaca arbitrage strategy for user ${userId}, client ${clientId}.`,
    );

    const intervalId = setInterval(async () => {
      const allOrdersFilled = await this.checkAndCleanFilledOrders(strategyKey);
      const currentOpenOrders = this.activeOrders.get(strategyKey)?.length || 0;

      if (allOrdersFilled && currentOpenOrders < maxOpenOrders) {
        await this.strategyService.evaluateArbitrageOpportunityVWAP(
          alpacaExchange,
          exchangeB,
          strategyParamsDto,
        );
      } else {
        this.logger.log(
          `Waiting for open orders to fill for ${strategyKey} before evaluating new opportunities.`,
        );
      }
    }, checkIntervalSeconds * 1000);

    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  // Method to handle derivatives arbitrage between Alpaca spot and futures/options
  async startAlpacaDerivativesArbitrage(
    strategyParamsDto: ArbitrageStrategyDto,
    derivativeType: 'futures' | 'options',
    checkIntervalSeconds: number,
  ) {
    const { userId, clientId, pair, exchangeBName } = strategyParamsDto;
    const strategyKey = createStrategyKey({
      type: `alpaca-${derivativeType}-arbitrage`,
      user_id: userId,
      client_id: clientId,
    });

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.log(
        `Alpaca ${derivativeType} strategy for user ${userId}, client ${clientId} for ${pair} is already running.`,
      );
      return;
    }

    const alpacaExchange = this.exchangeInitService.getExchange(
      'alpaca',
      'default',
    );
    const exchangeB = this.exchangeInitService.getExchange(exchangeBName);

    this.logger.log(
      `Starting Alpaca ${derivativeType} arbitrage strategy for user ${userId}, client ${clientId}.`,
    );

    const intervalId = setInterval(async () => {
      await this.evaluateDerivativesArbitrage(
        alpacaExchange,
        exchangeB,
        strategyParamsDto,
        derivativeType,
      );
    }, checkIntervalSeconds * 1000);

    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  // Custom logic to evaluate and execute arbitrage for derivatives
  private async evaluateDerivativesArbitrage(
    alpacaExchange: ccxt.Exchange,
    exchangeB: ccxt.Exchange,
    strategyParamsDto: ArbitrageStrategyDto,
    derivativeType: 'futures' | 'options',
  ) {
    const { userId, clientId, pair, amountToTrade, minProfitability } =
      strategyParamsDto;
    const strategyKey = createStrategyKey({
      type: `alpaca-${derivativeType}-arbitrage`,
      user_id: userId,
      client_id: clientId,
    });

    this.logger.log(
      `Evaluating ${derivativeType} arbitrage between Alpaca (spot) and ${exchangeB.name} (${derivativeType}) for ${pair}.`,
    );

    try {
      // Fetch spot price from Alpaca
      const alpacaTicker = await alpacaExchange.fetchTicker(pair);
      const alpacaSpotPrice = alpacaTicker.last;

      // Fetch derivative price from exchangeB
      let derivativePrice: number;
      if (derivativeType === 'futures') {
        derivativePrice = await this.fetchFuturesPrice(exchangeB, pair);
      } else if (derivativeType === 'options') {
        derivativePrice = await this.fetchOptionsPrice(exchangeB, pair);
      }

      this.logger.log(
        `${strategyKey}: Alpaca Spot Price: ${alpacaSpotPrice}, ${derivativeType} Price on ${exchangeB.name}: ${derivativePrice}`,
      );

      // Calculate profitability between Alpaca's spot price and the derivative price
      const profitMargin =
        (derivativePrice - alpacaSpotPrice) / alpacaSpotPrice;
      this.logger.log(`Profit Margin: ${profitMargin}`);

      if (profitMargin >= minProfitability) {
        this.logger.log(`Arbitrage opportunity detected! Executing trades.`);

        // Execute buy on Alpaca (spot) and sell on the derivative market (e.g., futures)
        await this.executeArbitrageTrade(
          userId,
          clientId,
          alpacaExchange,
          exchangeB,
          pair,
          amountToTrade,
          alpacaSpotPrice,
          derivativePrice,
        );
      } else if (
        (alpacaSpotPrice - derivativePrice) / derivativePrice >=
        minProfitability
      ) {
        this.logger.log(
          `Reverse arbitrage opportunity detected! Executing trades.`,
        );

        // Execute buy on the derivative market and sell on Alpaca (spot)
        await this.executeArbitrageTrade(
          userId,
          clientId,
          exchangeB,
          alpacaExchange,
          pair,
          amountToTrade,
          derivativePrice,
          alpacaSpotPrice,
        );
      } else {
        this.logger.log(`No arbitrage opportunity found.`);
      }
    } catch (error) {
      this.logger.error(
        `Error evaluating ${derivativeType} arbitrage: ${error.message}`,
      );
    }
  }

  // Fetch the current futures price for the given pair on exchangeB
  private async fetchFuturesPrice(
    exchangeB: ccxt.Exchange,
    pair: string,
  ): Promise<number> {
    const futuresTicker = await exchangeB.fetchTicker(pair); // Modify if necessary
    return futuresTicker.last;
  }

  // Fetch the current options price for the given pair on exchangeB
  private async fetchOptionsPrice(
    exchangeB: ccxt.Exchange,
    pair: string,
  ): Promise<number> {
    const optionsTicker = await exchangeB.fetchTicker(pair); // Modify if necessary
    return optionsTicker.last;
  }

  // Utility method to execute an arbitrage trade
  private async executeArbitrageTrade(
    userId,
    clientId,
    buyExchange: ccxt.Exchange,
    sellExchange: ccxt.Exchange,
    symbol: string,
    amount: number,
    buyPrice: number,
    sellPrice: number,
  ) {
    try {
      // Place buy limit order on buyExchange
      const buyOrder = await buyExchange.createLimitBuyOrder(
        symbol,
        amount,
        buyPrice,
      );
      this.logger.log(
        `Buy order placed on ${buyExchange.name}: ${buyOrder.id} at price ${buyPrice} for ${symbol}`,
      );

      // Place sell limit order on sellExchange
      const sellOrder = await sellExchange.createLimitSellOrder(
        symbol,
        amount,
        sellPrice,
      );
      this.logger.log(
        `Sell order placed on ${sellExchange.name}: ${sellOrder.id} at price ${sellPrice} for ${symbol}`,
      );

      // Optionally, log and save trade details in the database for performance tracking
      await this.saveArbitrageOrder(
        userId,
        clientId,
        symbol,
        buyPrice,
        sellPrice,
        buyOrder.id,
        sellOrder.id,
        amount,
      );
    } catch (error) {
      this.logger.error(`Error executing arbitrage trade: ${error.message}`);
    }
  }

  // Save the arbitrage order in the history
  private async saveArbitrageOrder(
    _userId: string,
    _clientId: string,
    pair: string,
    buyPrice: number,
    sellPrice: number,
    _buyOrderId: string,
    _sellOrderId: string,
    amount: number,
  ) {
    const profitLoss = sellPrice * amount - buyPrice * amount;

    const arbitrageOrder = this.arbitrageHistoryRepository.create({
      pair,
      buyPrice,
      sellPrice,
      profit: profitLoss,
      executedAt: new Date(),
      amount,
    });

    await this.arbitrageHistoryRepository.save(arbitrageOrder);
  }

  // VWAP Calculation for given amount
  private calculateVWAP(
    orderBook: ccxt.OrderBook,
    amount: number,
    side: 'buy' | 'sell',
  ): number {
    let totalVolume = 0;
    let totalPriceVolume = 0;
    const orders = side === 'buy' ? orderBook.asks : orderBook.bids;

    for (const [price, volume] of orders) {
      const volumeToUse = Math.min(volume, amount - totalVolume);
      totalPriceVolume += price * volumeToUse;
      totalVolume += volumeToUse;

      if (totalVolume >= amount) break;
    }

    return totalPriceVolume / totalVolume;
  }

  // Checks if all orders for the strategy are filled and cleans up
  private async checkAndCleanFilledOrders(
    strategyKey: string,
  ): Promise<boolean> {
    const activeOrdersForStrategy = this.activeOrders.get(strategyKey) || [];
    let allOrdersFilled = true;

    for (const { exchange, orderId, symbol } of activeOrdersForStrategy) {
      const order = await exchange.fetchOrder(orderId, symbol);
      if (order.status !== 'closed') {
        allOrdersFilled = false;
        break;
      }
    }

    if (allOrdersFilled) {
      this.activeOrders.delete(strategyKey);
    }

    return allOrdersFilled;
  }
}
// TODO:
// Error Handling
// Improving profitability calculations
// add transaction costs and Fees
// Optimizing Market Data Usage / Adding redis and caching the order book
// Implementing Advanced Risk Management
