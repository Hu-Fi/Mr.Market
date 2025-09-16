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
      let strategyInstance = await this.strategyInstanceRepository.findOne({
        where: { strategyKey },
      });

      const exchange = this.exchangeInitService.getExchange(exchangeName);
      const ticker = await exchange.fetchTicker(symbol);
      const startPrice = Math.trunc(ticker.last);

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
        await this.strategyInstanceRepository.save(strategyInstance);
      } else {
        await this.strategyInstanceRepository.update(
          { strategyKey },
          { status: 'running', updatedAt: new Date() },
        );
      }

      const exchangeAccount1 = this.exchangeInitService.getExchange(
        exchangeName,
        'default',
      );
      const exchangeAccount2 = this.exchangeInitService.getExchange(
        exchangeName,
        'account2',
      );

      let tradesExecuted = 0;
      let useAccount1AsMaker = true;

      /* helper → fetch free balances for base / quote */
      const getFree = async (
        exch: ccxt.Exchange,
        base: string,
        quote: string,
      ) => {
        const bal = await exch.fetchBalance();
        return {
          base: bal.free[base] ?? 0,
          quote: bal.free[quote] ?? 0,
        };
      };

      /* helper → one-shot rebalance so the next trade can proceed */
      const rebalance = async (
        exch: ccxt.Exchange,
        needSide: 'buy' | 'sell',
        amountNeeded: number,
        price: number,
      ) => {
        if (needSide === 'buy') {
          /* need more base, so buy base with quote */
          if (amountNeeded > 0)
            await exch.createOrder(symbol, 'market', 'buy', amountNeeded);
        } else {
          /* need more quote, so sell base for quote */
          const baseToSell = amountNeeded / price;
          if (baseToSell > 0)
            await exch.createOrder(symbol, 'market', 'sell', baseToSell);
        }
      };

      /* ── capture initial portfolio value ── */
      const [baseAsset, quoteAsset] = symbol.split('/');
      const initBal1 = await getFree(exchangeAccount1, baseAsset, quoteAsset);
      const initBal2 = await getFree(exchangeAccount2, baseAsset, quoteAsset);
      const initialTotalQuoteValue =
        (initBal1.base + initBal2.base) * startPrice +
        (initBal1.quote + initBal2.quote);

      /* ── trading loop ── */
      const executeTrade = async () => {
        if (tradesExecuted >= numTrades) {
          this.logger.log(
            `Volume strategy [${strategyKey}] completed after ${numTrades} trades.`,
          );
          this.strategyInstances.delete(strategyKey);
          return;
        }

        try {
          /* cancel leftovers */
          await this.cancelAllOrders(exchangeAccount1, symbol, strategyKey);
          await this.cancelAllOrders(exchangeAccount2, symbol, strategyKey);

          const makerExchange = useAccount1AsMaker
            ? exchangeAccount1
            : exchangeAccount2;
          const takerExchange = useAccount1AsMaker
            ? exchangeAccount2
            : exchangeAccount1;

          const makerSide: 'buy' | 'sell' = postOnlySide;
          const takerSide: 'buy' | 'sell' =
            postOnlySide === 'buy' ? 'sell' : 'buy';

          const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
          const amount = baseTradeAmount * randomFactor;

          const makerBook = await makerExchange.fetchOrderBook(symbol);
          const bestBid = makerBook.bids[0][0];
          const bestAsk = makerBook.asks[0][0];
          const midPrice = (bestBid + bestAsk) / 2;

          /* balances + PnL */
          const makerBalances = await getFree(
            makerExchange,
            baseAsset,
            quoteAsset,
          );
          const takerBalances = await getFree(
            takerExchange,
            baseAsset,
            quoteAsset,
          );

          const currentTotalQuoteValue =
            (makerBalances.base + takerBalances.base) * midPrice +
            (makerBalances.quote + takerBalances.quote);

          const pnlSinceStart = currentTotalQuoteValue - initialTotalQuoteValue;

          this.logger.log(
            `[${strategyKey}] Balances | ${
              makerExchange.id
            }: ${baseAsset}=${makerBalances.base.toFixed(
              4,
            )}, ${quoteAsset}=${makerBalances.quote.toFixed(2)} | ${
              takerExchange.id
            }: ${baseAsset}=${takerBalances.base.toFixed(
              4,
            )}, ${quoteAsset}=${takerBalances.quote.toFixed(
              2,
            )} | PnL: ${pnlSinceStart.toFixed(2)} ${quoteAsset}`,
          );

          /* maker side sufficient? */
          if (
            makerSide === 'buy' &&
            makerBalances.quote < amount * midPrice * 1.01
          ) {
            const deficitBase =
              (amount * midPrice - makerBalances.quote) / midPrice;
            await rebalance(makerExchange, 'buy', deficitBase, midPrice);
          } else if (
            makerSide === 'sell' &&
            makerBalances.base < amount * 1.01
          ) {
            const deficitQuote = amount - makerBalances.base;
            await rebalance(makerExchange, 'sell', deficitQuote, midPrice);
          }

          /* taker side sufficient? */
          if (
            takerSide === 'buy' &&
            takerBalances.quote < amount * midPrice * 1.01
          ) {
            const deficitBase =
              (amount * midPrice - takerBalances.quote) / midPrice;
            await rebalance(takerExchange, 'buy', deficitBase, midPrice);
          } else if (
            takerSide === 'sell' &&
            takerBalances.base < amount * 1.01
          ) {
            const deficitQuote = amount - takerBalances.base;
            await rebalance(takerExchange, 'sell', deficitQuote, midPrice);
          }

          /* choose random maker price inside spread */
          const makerPrice = bestBid + Math.random() * (bestAsk - bestBid);
          const takerPrice = makerPrice;

          const makerOrder = await makerExchange.createOrder(
            symbol,
            'limit',
            makerSide,
            amount,
            makerPrice,
            { postOnly: true },
          );

          const takerOrder = await takerExchange.createOrder(
            symbol,
            'limit',
            takerSide,
            amount,
            takerPrice,
          );

          /* log fills */
          const makerResult = await makerExchange.fetchOrder(
            makerOrder.id,
            symbol,
          );
          const takerResult = await takerExchange.fetchOrder(
            takerOrder.id,
            symbol,
          );

          if (
            makerResult.status === 'closed' ||
            makerResult.status === 'filled'
          ) {
            this.logger.log(
              `Maker ${makerSide.toUpperCase()} on ${
                makerExchange.id
              } filled at ${makerPrice.toFixed(6)}`,
            );
          }

          if (
            takerResult.status === 'closed' ||
            takerResult.status === 'filled'
          ) {
            this.logger.log(
              `Taker ${takerSide.toUpperCase()} on ${
                takerExchange.id
              } filled at ${takerPrice.toFixed(6)}`,
            );
          }

          tradesExecuted++;
          useAccount1AsMaker = !useAccount1AsMaker;

          const minInterval = baseIntervalTime;
          const maxInterval = baseIntervalTime * 1.5;
          const delaySeconds = Math.floor(
            minInterval + Math.random() * (maxInterval - minInterval),
          );

          this.logger.log(
            `Trade #${tradesExecuted} done. Next trade in ~${delaySeconds}s.`,
          );
          setTimeout(executeTrade, delaySeconds * 1000);
        } catch (error) {
          this.logger.error(`Error in trade cycle: ${error.message}`);
          const retryDelay = Math.floor(
            baseIntervalTime + Math.random() * (baseIntervalTime * 0.5),
          );
          this.logger.log(`Retrying volume trade in ${retryDelay}s.`);
          setTimeout(executeTrade, retryDelay * 1000);
        }
      };

      this.strategyInstances.set(strategyKey, {
        isRunning: true,
        intervalId: null,
      });
      this.logger.log(`Volume strategy [${strategyKey}] started.`);
      executeTrade();
    } catch (error) {
      this.logger.error(
        `Failed to execute volume strategy [${strategyKey}]: ${error.message}`,
      );
    }
  }

  /**
   * Cancel leftover orders for a given exchange, symbol, and strategyKey.
   */
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
        await this.strategyInstanceRepository.save(strategyInstance);
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
