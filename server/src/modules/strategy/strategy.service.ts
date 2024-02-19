import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { TradeService } from '../trade/trade.service';
import { ArbitrageStrategyDto, PureMarketMakingStrategyDto } from './strategy.dto';
import { PerformanceService } from '../performance/performance.service';


@Injectable()
export class StrategyService {
    private readonly logger = new Logger(StrategyService.name);

    private orderBookCache = new Map<string, { data: ccxt.OrderBook, timestamp: number }>();
    private strategyInstances = new Map<string, { isRunning: boolean, intervalId: NodeJS.Timeout }>();
    private exchanges = new Map<string, ccxt.Exchange>();
    private activeOrderBookWatches = new Map<string, Set<string>>(); // Tracks active watches for each strategy
    private activeOrders: Map<string, {exchange: ccxt.Exchange, orderId: string}[]> = new Map();


    constructor(
        private tradeService: TradeService,
        private performanceService: PerformanceService
        ) {
        this.initializeExchanges();
        process.on('SIGINT', () => this.handleShutdown());
        process.on('SIGTERM', () => this.handleShutdown());
        process.on('uncaughtException', () => this.handleShutdown());
    }

    private async initializeExchanges() {
        // Initialize exchanges
        this.exchanges.set('bitfinex', new ccxt.pro.bitfinex({ apiKey: process.env.BITFINEX_API_KEY, secret: process.env.BITFINEX_SECRET }));
        this.exchanges.set('mexc', new ccxt.pro.mexc({ apiKey: process.env.MEXC_API_KEY, secret: process.env.MEXC_SECRET }));
        this.exchanges.set('binance', new ccxt.pro.binance({ apiKey: process.env.BINANCE_API_KEY, secret: process.env.BINANCE_SECRET }))
    }

    async getSupportedExchanges(): Promise<string[]> {
        const supportedExchanges: string[] = [];
        this.exchanges.forEach((_, exchangeName) => {
            supportedExchanges.push(exchangeName);
        });
        return supportedExchanges;
    }


    async startArbitrageStrategyForUser(strategyParamsDto: ArbitrageStrategyDto) {
        const { userId, clientId, pair, minProfitability, exchangeAName, exchangeBName } = strategyParamsDto;
        const strategyKey = `${userId}-${clientId}-Arbitrage`;
        let exchangeA: ccxt.Exchange;
        let exchangeB: ccxt.Exchange;
        exchangeA = this.exchanges.get(exchangeAName);
        exchangeB = this.exchanges.get(exchangeBName);

        if (!exchangeA || !exchangeB) {
            this.logger.error(`Exchanges ${exchangeAName} or ${exchangeBName} are not configured.`);
            throw new InternalServerErrorException('Exchange configuration error.');
        }

        if (this.strategyInstances.has(strategyKey)) {
            this.logger.log(`Strategy already running for user ${userId} and client ${clientId}`);
            return;
        }

        this.logger.log(`Starting arbitrage strategy for user ${userId}, client ${clientId}`);
        // Add the pair to active watches for this strategy
        const watchSet = this.activeOrderBookWatches.get(strategyKey) || new Set();
        watchSet.add(pair);
        this.activeOrderBookWatches.set(strategyKey, watchSet);

        this.watchSymbols(exchangeA, exchangeB, pair, strategyKey);

        const intervalId = setInterval(() => {
            this.evaluateArbitrageOpportunityVWAP(exchangeA, exchangeB, strategyParamsDto);
        }, 1000); // Run every 1 second


        this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
    }

    async stopStrategyForUser(userId: string, clientId: string,strategyType?: string) {
        let strategyKey;
        if (strategyType='Arbitrage'){
            strategyKey = `${userId}-${clientId}-Arbitrage`;
        }
        if (strategyType='pureMarketMaking'){
            strategyKey = `${userId}-${clientId}-pureMarketMaking`;
        }
        const strategyInstance = this.strategyInstances.get(strategyKey);
        this.logger.log(strategyKey)
        if (strategyInstance) {
            clearInterval(strategyInstance.intervalId);
            this.strategyInstances.delete(strategyKey);
            this.logger.log(`Stopped ${strategyType} strategy for user ${userId}, client ${clientId}`);

            // Remove the pairs from active watches
            this.activeOrderBookWatches.delete(strategyKey);
        }
    }

    

    private async watchSymbols(exchangeA, exchangeB, pair: string, strategyKey: string) {
        this.watchOrderBook(exchangeA, pair, strategyKey);
        this.watchOrderBook(exchangeB, pair, strategyKey);
    }

    private async watchOrderBook(exchange: ccxt.Exchange, symbol: string, strategyKey: string) {
        while (this.activeOrderBookWatches.get(strategyKey)?.has(symbol)) {
            try {
                const newOrderbook = await exchange.watchOrderBook(symbol);
                this.orderBookCache.set(symbol + '-' + exchange.id, { data: newOrderbook, timestamp: Date.now() });
                // Notify strategies if needed
            } catch (error) {
                this.logger.error(`Error in watchOrderBook: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }


async executePureMarketMakingStrategy(strategyParamsDto: PureMarketMakingStrategyDto) {
    const { userId, clientId, pair, exchangeName, bidSpread, askSpread, orderAmount, orderRefreshTime } = strategyParamsDto;
    const strategyKey = `${userId}-${clientId}-pureMarketMaking`;


    // Ensure the strategy is not already running
    if (this.strategyInstances.has(strategyKey)) {
        this.logger.error(`Strategy ${strategyKey} is already running.`);
        return;
    }

    // Start the strategy
    this.logger.log(`Starting pure market making strategy for ${strategyKey}.`);
    const intervalId = setInterval(async () => {
        try {
            await this.manageMarketMakingOrders(userId, clientId, exchangeName, pair, bidSpread, askSpread, orderAmount);
        } catch (error) {
            this.logger.error(`Error executing pure market making strategy for ${strategyKey}: ${error.message}`);
            clearInterval(intervalId); // Optionally stop the strategy on error
        }
    }, orderRefreshTime);

    // Track the strategy instance
    this.strategyInstances.set(strategyKey, { isRunning: true, intervalId });
}

private async manageMarketMakingOrders(userId: string, clientId: string, exchangeName: string, pair: string, bidSpread: number, askSpread: number, orderAmount: number) {
    // Fetch the current mid-price
    const midPrice = await this.getMidPrice(exchangeName, pair); // Implement this method based on your exchange's API
    const buyPrice = midPrice * (1 - bidSpread);
    const sellPrice = midPrice * (1 + askSpread);
    const strategyKey = `${userId}-${clientId}-pureMarketMaking`;

    // Cancel all existing orders for this strategy
    const exchange = this.exchanges.get(exchangeName)
    this.cancelAllOrders(exchange,pair,strategyKey)

    // Place new buy and sell limit orders
    await this.tradeService.executeLimitTrade({
        userId, clientId, exchange: exchangeName, symbol: pair, side: 'buy', amount: orderAmount, price: buyPrice
    });
    await this.tradeService.executeLimitTrade({
        userId, clientId, exchange: exchangeName, symbol: pair, side: 'sell', amount: orderAmount, price: sellPrice
    });

    this.logger.log(`Placed new market making orders for ${pair} at buy: ${buyPrice}, sell: ${sellPrice}`);
}


private async cancelAllOrders(exchange: ccxt.Exchange, pair: string, strategyKey: string) {
      // Fetch and cancel all open orders for the pair
  const orders = await exchange.fetchOpenOrders(pair);
  for (const order of orders) {
    await exchange.cancelOrder(order.id, pair);
  }
}

async getMidPrice(exchangeName: string, pair: string): Promise<number> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange) {
        throw new Error(`Exchange ${exchangeName} is not configured.`);
    }
    const orderBook = await exchange.fetchOrderBook(pair);
    const bids = orderBook.bids.length > 0 ? orderBook.bids[0][0] : 0;
    const asks = orderBook.asks.length > 0 ? orderBook.asks[0][0] : 0;
    return (bids + asks) / 2;
}

private async evaluateArbitrageOpportunityVWAP(exchangeA, exchangeB, strategyParamsDto: ArbitrageStrategyDto) {
    const { userId, clientId, pair, amountToTrade, minProfitability } = strategyParamsDto;
    const cacheKeyA = `${pair}-${exchangeA.id}`;
    const cacheKeyB = `${pair}-${exchangeB.id}`;
    const cachedOrderBookA = this.orderBookCache.get(cacheKeyA);
    const cachedOrderBookB = this.orderBookCache.get(cacheKeyB);
    const strategyKey = `${userId}-${clientId}-Arbitrage`;

        // Check and clean filled orders before evaluating opportunities
        const allOrdersFilled = await this.checkAndCleanFilledOrders(strategyKey);
        if (!allOrdersFilled) {
            this.logger.log(`Waiting for open orders to fill for ${strategyKey} before evaluating new opportunities.`);
            return;
        }

    if (cachedOrderBookA && cachedOrderBookB && this.isDataFresh(cachedOrderBookA.timestamp) && this.isDataFresh(cachedOrderBookB.timestamp)) {
        const vwapA = this.calculateVWAPForAmount(cachedOrderBookA.data, amountToTrade, 'buy');
        const vwapB = this.calculateVWAPForAmount(cachedOrderBookB.data, amountToTrade, 'sell');

        if ((vwapB - vwapA) / vwapA >= minProfitability) {
            // Execute trades
            this.logger.log(`User ${userId}, Client ${clientId}: Arbitrage opportunity for ${pair} (VWAP): Buy on ${exchangeA.name} at ${vwapA}, sell on ${exchangeB.name} at ${vwapB}`);
            //  await this.executeArbitrageTradeWithLimitOrders(exchangeA, exchangeB, pair, amountToTrade, userId, clientId, vwapA, vwapB);

        } else if ((vwapA - vwapB) / vwapB >= minProfitability) {
            // Execute trades in reverse direction
            this.logger.log(`User ${userId}, Client ${clientId}: Arbitrage opportunity for ${pair} (VWAP): Buy on ${exchangeB.name} at ${vwapB}, sell on ${exchangeA.name} at ${vwapA}`);
            // await this.executeArbitrageTradeWithLimitOrders(exchangeB, exchangeA, pair, amountToTrade, userId, clientId, vwapB, vwapA);
        }
    } else {
        this.logger.log('Order book data is not fresh enough for reliable arbitrage calculation.');
    }
}

private async executeArbitrageTradeWithLimitOrders(exchangeA: ccxt.Exchange, exchangeB: ccxt.Exchange, symbol: string, amount: number, userId: string, clientId: string, buyPrice: number, sellPrice: number) {
    const strategyKey = `${userId}-${clientId}-Arbitrage`;
    try {
        // Place buy limit order on Exchange A
        const buyOrder = await this.tradeService.executeLimitTrade({
            userId, clientId, exchange: exchangeA.id, symbol, side: 'buy', amount, price: buyPrice
        });
        // keep count of open orders
        const orderADetails = { exchange: exchangeA, orderId: buyOrder.id };
        this.activeOrders.set(strategyKey, [...(this.activeOrders.get(strategyKey) || []), orderADetails]);

        // Proceed to place sell limit order on Exchange B
        const sellOrder = await this.tradeService.executeLimitTrade({
            userId, clientId, exchange: exchangeB.id, symbol, side: 'sell', amount, price: sellPrice
        });
        const orderBDetails = { exchange: exchangeB, orderId: sellOrder.id };
        this.activeOrders.set(strategyKey, [...(this.activeOrders.get(strategyKey) || []), orderBDetails]);

        // Calculate fees for both orders
        // This example assumes fees are returned with the order info and are in the quote currency
        const buyFee = buyOrder.fee ? buyOrder.fee.cost : 0; // Adjust based on your fee structure
        const sellFee = sellOrder.fee ? sellOrder.fee.cost : 0;

        // Calculate profit/loss, adjusting for fees
        const profitLoss = (sellPrice * amount - sellFee) - (buyPrice * amount + buyFee);

        // Log and record the trade execution and performance
        this.logger.log(`Arbitrage trade executed with limit orders for user ${userId}, client ${clientId}: Buy on ${exchangeA.id} at ${buyPrice}, sell on ${exchangeB.id} at ${sellPrice}, Profit/Loss: ${profitLoss}`);

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
        this.logger.error(`Failed to execute arbitrage trade with limit orders: ${error.message}`);
    }
}

private calculateVWAPForAmount(orderBook: ccxt.OrderBook, amountToTrade: number, direction: 'buy' | 'sell'): number {
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

    return volumeAccumulated > 0 ? volumePriceProductSum / volumeAccumulated : 0;
}

private async checkAndCleanFilledOrders(strategyKey: string): Promise<boolean> {
    const activeOrdersForStrategy = this.activeOrders.get(strategyKey) || [];
    let allOrdersFilled = true; // Assume all orders are filled initially

    for (let i = 0; i < activeOrdersForStrategy.length; i++) {
        const { exchange, orderId } = activeOrdersForStrategy[i];
        try {
            const order = await exchange.fetchOrder(orderId);
            if (order.status !== 'closed' && order.status !== 'filled') {
                allOrdersFilled = false; // Found an order that's not filled
                break; // No need to check further
            }
        } catch (error) {
            this.logger.error(`Error checking order status for ${orderId} on ${exchange.id}: ${error.message}`);
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
        const freshnessThreshold = 10000; // 30 seconds
        return (Date.now() - timestamp) < freshnessThreshold;
    }



    private handleShutdown() {
        this.logger.log('Shutting down strategy service...');
        this.strategyInstances.forEach((instance, key) => {
            clearInterval(instance.intervalId);
        });
        this.strategyInstances.clear();

        this.activeOrderBookWatches.clear();

        process.exit(0);
    }
}
