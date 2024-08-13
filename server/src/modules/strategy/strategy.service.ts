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
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { StrategyKey, createStrategyKey } from 'src/common/helpers/strategyKey';
import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';

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
  private activeOrders: Map<
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
  ) {
    process.on('SIGINT', () => this.handleShutdown());
    process.on('SIGTERM', () => this.handleShutdown());
    process.on('uncaughtException', () => this.handleShutdown());
  }

  async getSupportedExchanges(): Promise<string[]> {
    return this.exchangeInitService.getSupportedExchanges();
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
    const exchangeA = this.exchangeInitService.getExchange(exchangeAName);
    const exchangeB = this.exchangeInitService.getExchange(exchangeBName);

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

    // Cancel all orders for this strategy before stopping
    if (strategyKey) {
      await this.cancelAllStrategyOrders(strategyKey);
    }

    const strategyInstance = this.strategyInstances.get(strategyKey);
    if (strategyInstance) {
      clearInterval(strategyInstance.intervalId);
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
  ) {
    const strategyKey = createStrategyKey({
      type: 'volume',
      user_id: userId,
      client_id: clientId,
    });

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.warn(`Strategy ${strategyKey} is already running.`);
      return;
    }

    try {
      const exchangeAccount1 = this.exchangeInitService.getExchange(
        exchangeName,
        'default',
      );
      const exchangeAccount2 = this.exchangeInitService.getExchange(
        exchangeName,
        'account2',
      );

      let useAccount1 = true;
      let tradesExecuted = 0;

      const executeTrade = async () => {
        if (tradesExecuted >= numTrades) {
          this.logger.log(`Volume strategy ${strategyKey} completed.`);
          this.strategyInstances.delete(strategyKey);
          return;
        }

        try {
          // Randomly decide whether to pause the strategy
          if (Math.random() > 0.91 && tradesExecuted > 5) {
            // 9% chance to pause after a trade
            const pauseDuration = Math.floor(Math.random() * 4) + 1; // Pause for 1 to 4 minutes
            this.logger.log(`Pausing strategy for ${pauseDuration} minutes.`);
            await new Promise((resolve) =>
              setTimeout(resolve, pauseDuration * 60000),
            ); // Pause execution
          }

          // Fetch the order book to calculate the initial price
          const orderBook = await exchangeAccount1.fetchOrderBook(symbol);
          let highestBid = orderBook.bids[0][0];
          let lowestAsk = orderBook.asks[0][0];

          this.logger.log(`Initial highest bid for ${symbol} is ${highestBid}`);
          this.logger.log(`Initial lowest ask for ${symbol} is ${lowestAsk}`);

          const buyExchange = useAccount1 ? exchangeAccount1 : exchangeAccount2;
          const sellExchange = useAccount1
            ? exchangeAccount2
            : exchangeAccount1;

          // Randomize the price adjustment percentage
          const variableIncrementPercentage =
            baseIncrementPercentage * (1 + (Math.random() - 0.5) / 20); // Varies by ±2.5%

          // Determine the start price for the current trade
          let currentPrice;
          if (useAccount1) {
            currentPrice = highestBid * (1 + variableIncrementPercentage / 100);
          } else {
            currentPrice = lowestAsk * (1 - variableIncrementPercentage / 100);
          }

          // Randomize the trade amount
          const variableTradeAmount =
            baseTradeAmount * (1 + (Math.random() - 0.5) / 10); // Varies by ±5%

          // Place buy order on the selected exchange
          const buyOrder = await buyExchange.createLimitBuyOrder(
            symbol,
            variableTradeAmount,
            currentPrice,
          );
          this.logger.log(
            `Buy order placed on ${buyExchange.id}: ${buyOrder.id} at price ${currentPrice} with amount ${variableTradeAmount}`,
          );

          // Place sell order on the other exchange
          const sellOrder = await sellExchange.createLimitSellOrder(
            symbol,
            variableTradeAmount,
            currentPrice,
          );
          this.logger.log(
            `Sell order placed on ${sellExchange.id}: ${sellOrder.id} at price ${currentPrice} with amount ${variableTradeAmount}`,
          );

          // Optionally, wait for orders to be filled or perform additional checks here
          await this.waitForOrderFill(buyExchange, buyOrder.id, symbol);
          await this.waitForOrderFill(sellExchange, sellOrder.id, symbol);

          // Increment the price by the specified percentage for the next trade
          if (useAccount1) {
            highestBid = currentPrice;
          } else {
            lowestAsk = currentPrice;
          }

          // Alternate the account usage
          useAccount1 = !useAccount1;
          tradesExecuted++;

          // Randomize the interval time for the next trade
          const randomInterval =
            baseIntervalTime + Math.floor(Math.random() * baseIntervalTime);
          setTimeout(executeTrade, randomInterval * 1000); // Execute the next trade after a random interval
        } catch (error) {
          this.logger.error(`Error executing trade: ${error.message}`);
          // Even if there's an error, wait before trying the next trade
          const randomInterval =
            baseIntervalTime + Math.floor(Math.random() * baseIntervalTime);
          setTimeout(executeTrade, randomInterval * 1000);
        }
      };

      // Start the first trade execution
      this.strategyInstances.set(strategyKey, {
        isRunning: true,
        intervalId: null,
      });
      this.logger.log(`Volume strategy ${strategyKey} started.`);
      executeTrade(); // Start the execution loop
    } catch (error) {
      this.logger.error(`Failed to execute volume strategy: ${error.message}`);
    }
  }

  private async waitForOrderFill(
    exchange: ccxt.Exchange,
    orderId: string,
    symbol: string,
  ) {
    // Wait for the order to be filled (implementation can vary based on your requirements)
    let order = await exchange.fetchOrder(orderId, symbol);
    while (order.status !== 'closed') {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
      order = await exchange.fetchOrder(orderId, symbol);
    }
  }

  stopVolumeStrategy(userId: string, clientId: string) {
    const strategyKey = createStrategyKey({
      type: 'volume',
      user_id: userId,
      client_id: clientId,
    });
    const strategyInstance = this.strategyInstances.get(strategyKey);

    if (strategyInstance) {
      clearInterval(strategyInstance.intervalId);
      this.cancelAllStrategyOrders(strategyKey);
      this.strategyInstances.delete(strategyKey);
      this.logger.log(`Volume strategy ${strategyKey} stopped.`);
    } else {
      this.logger.warn(`No active strategy found for ${strategyKey}.`);
    }
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

    // Start the strategy
    this.logger.log(`Starting pure market making strategy for ${strategyKey}.`);
    const intervalId = setInterval(async () => {
      try {
        await this.manageMarketMakingOrdersWithLayers(
          userId,
          clientId,
          exchangeName,
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
        );
      } catch (error) {
        this.logger.error(
          `Error executing pure market making strategy for ${strategyKey}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying or moving on
      }
    }, orderRefreshTime);

    // Track the strategy instance
    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
  }

  private async manageMarketMakingOrdersWithLayers(
    userId: string,
    clientId: string,
    exchangeName: string,
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
  ) {
    // Fetch the current market price based on the specified price source type
    const priceSource = await this.getPriceSource(
      exchangeName,
      pair,
      priceSourceType,
    );
    const exchange = this.exchangeInitService.getExchange(exchangeName);

    // Cancel all existing orders for this strategy
    await this.cancelAllOrders(
      exchange,
      pair,
      createStrategyKey({
        type: 'pureMarketMaking',
        user_id: userId,
        client_id: clientId,
      }),
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

      // Conditionally place buy and sell orders based on ceiling and floor price logic
      if (ceilingPrice === undefined || priceSource <= ceilingPrice) {
        // Place buy orders as market price is not above the ceiling
        const {
          adjustedAmount: adjustedBuyAmount,
          adjustedPrice: adjustedBuyPrice,
        } = await this.adjustOrderParameters(
          exchange,
          pair,
          currentOrderAmount,
          buyPrice,
        );

        const order = await this.tradeService.executeLimitTrade({
          userId,
          clientId,
          exchange: exchangeName,
          symbol: pair,
          side: 'buy',
          amount: parseFloat(adjustedBuyAmount),
          price: parseFloat(adjustedBuyPrice),
        });

        // Create and save the order entity
        const orderEntity = this.orderRepository.create({
          userId,
          clientId,
          exchange: exchangeName,
          pair,
          side: 'buy',
          amount: parseFloat(adjustedBuyAmount),
          price: parseFloat(adjustedBuyPrice),
          orderId: order.id,
          executedAt: new Date(), // Assuming immediate execution; adjust as necessary
          status: order.status,
          strategy: 'pureMarketMaking',
        });

        await this.orderRepository.save(orderEntity);
      } else {
        this.logger.log(
          `Skipping buy order for ${pair} as price source ${priceSource} is above the ceiling price ${ceilingPrice}.`,
        );
      }

      if (floorPrice === undefined || priceSource >= floorPrice) {
        // Place sell orders as market price is not below the floor
        const {
          adjustedAmount: adjustedSellAmount,
          adjustedPrice: adjustedSellPrice,
        } = await this.adjustOrderParameters(
          exchange,
          pair,
          currentOrderAmount,
          sellPrice,
        );

        const order = await this.tradeService.executeLimitTrade({
          userId,
          clientId,
          exchange: exchangeName,
          symbol: pair,
          side: 'sell',
          amount: parseFloat(adjustedSellAmount),
          price: parseFloat(adjustedSellPrice),
        });

        // Create and save the order entity
        const orderEntity = this.orderRepository.create({
          userId,
          clientId,
          exchange: exchangeName,
          pair,
          side: 'sell',
          amount: parseFloat(adjustedSellAmount),
          price: parseFloat(adjustedSellPrice),
          orderId: order.id,
          executedAt: new Date(),
          status: order.status,
          strategy: 'pureMarketMaking',
        });

        await this.orderRepository.save(orderEntity);
      } else {
        this.logger.log(
          `Skipping sell order for ${pair} as price source ${priceSource} is below the floor price ${floorPrice}.`,
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

  private async cancelAllOrders(
    exchange: ccxt.Exchange,
    pair: string,
    strategyKey: string,
  ) {
    this.logger.log('Cancelling Orders for', strategyKey);
    try {
      const orders = await exchange.fetchOpenOrders(pair);
      for (const order of orders) {
        try {
          await exchange.cancelOrder(order.id, pair);
        } catch (error) {
          this.logger.error(
            `Failed to cancel order ${order.id} for ${pair} on ${exchange.id}: ${error.message}`,
          );
          // Decide whether to retry or continue with the next order
        }
      }
    } catch (error) {
      this.logger.error(
        `Error fetching open orders for ${pair} on ${exchange.id}: ${error.message}`,
      );
      // Handle the error, e.g., by logging and possibly retrying later
    }
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

  private async evaluateArbitrageOpportunityVWAP(
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
    const strategyKey = createStrategyKey({
      type: 'arbitrage',
      user_id: userId,
      client_id: clientId,
    });
    this.logger.log(strategyKey);
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

  private async checkAndCleanFilledOrders(
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

  private handleShutdown() {
    this.logger.log('Shutting down strategy service...');

    // Cancel all orders before shutting down strategies
    this.strategyInstances.forEach((_, strategyKey) => {
      this.cancelAllStrategyOrders(strategyKey)
        .then(() => {
          this.logger.log(`All orders canceled for ${strategyKey}`);
        })
        .catch((error) => {
          this.logger.error(
            `Failed to cancel orders for ${strategyKey}: ${error}`,
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
    const activeOrdersForStrategy = this.activeOrders.get(strategyKey) || [];

    for (const orderDetail of activeOrdersForStrategy) {
      const { exchange, orderId, symbol } = orderDetail;

      try {
        await exchange.cancelOrder(orderId, symbol);
        this.logger.log(`Order ${orderId} canceled successfully.`);
      } catch (error) {
        this.logger.error(`Failed to cancel order ${orderId}: ${error}`);
      }
    }

    // Remove strategy from activeOrders map after canceling all orders
    this.activeOrders.delete(strategyKey);
  }
}
