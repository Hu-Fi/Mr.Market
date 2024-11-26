/**
 * MarketdataService
 *
 * This service handles interactions with various cryptocurrency exchanges using the CCXT library.
 * It supports fetching and watching market data such as tickers, OHLCV data, and order books.
 * The service also implements caching to reduce API calls and improve performance.
 *
 * Dependencies:
 * - ccxt: Cryptocurrency exchange trading library.
 * - Cache: NestJS cache manager for caching API responses.
 * - CustomLogger: Custom logging service for recording errors and log information.
 * - SUPPORTED_PAIRS: Constant defining supported trading pairs.
 * - createCompositeKey: Helper function to create composite keys for subscription management.
 * - decodeTicker: Helper function to decode ticker data.
 *
 * Configuration:
 * - cachingTTL: Time-to-live for cached data (10 seconds).
 *
 * Methods:
 * - constructor: Initializes the service with the injected Cache and sets up exchanges.
 * - initializeExchange(): Initializes the cryptocurrency exchanges with API keys and secrets.
 *
 * - getTickers(exchange: string, symbols: string[]): Fetches tickers for specified symbols from a given exchange.
 *
 * - getOHLCVData(exchange: string, symbol: string, timeframe: string, since?: number, limit?: number):
 *   Fetches OHLCV data for a specified symbol from a given exchange.
 *
 * - getSupportedPairs(): Fetches supported trading pairs, utilizing caching to reduce API calls.
 * - _getSupportedPairs(): Internal method to fetch supported trading pairs directly from exchanges.
 *
 * - watchOrderBook(exchangeName: string, symbol: string, onData: (data: any) => void, limit?: number):
 *   Subscribes to order book updates for a specified symbol from a given exchange.
 *
 * - watchOHLCV(exchangeName: string, symbol: string, onData: (data: any) => void, timeFrame?: string, since?: number, limit?: number):
 *   Subscribes to OHLCV data updates for a specified symbol from a given exchange.
 *
 * - watchTicker(exchangeName: string, symbol: string, onData: (data: any) => void):
 *   Subscribes to ticker updates for a specified symbol from a given exchange.
 *
 * - watchTickers(exchangeName: string, symbol: string[], onData: (data: any) => void):
 *   Subscribes to ticker updates for multiple symbols from a given exchange.
 *
 * - isSubscribed(type: marketDataType, exchangeName: string, symbol?: string, symbols?: string[], timeFrame?: string):
 *   Checks if a subscription is active for the given parameters.
 *
 * - unsubscribeOrderBook(exchangeName: string, symbol: string): Unsubscribes from order book updates for a specified symbol.
 *
 * - getTickerPrice(exchangeName: string, symbol: string): Fetches the latest ticker price for a specified symbol from a given exchange.
 *
 * - getMultipleTickerPrices(exchangeNames: string[], symbols: string[]): Fetches ticker prices for multiple symbols across multiple exchanges.
 *
 * - getSupportedSymbols(exchangeName: string): Fetches supported symbols from a given exchange.
 *
 * - unsubscribeData(type: marketDataType, exchangeName: string, symbol?: string, symbols?: string[], timeFrame?: string):
 *   Unsubscribes from data updates for the given parameters.
 *
 * Notes:
 * - The service uses activeSubscriptions to manage active data subscriptions.
 * - Error handling is implemented to log and manage errors during API interactions.
 * - The service ensures efficient handling of market data updates through subscription management and caching.
 */

import * as ccxt from 'ccxt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { SUPPORTED_PAIRS } from 'src/common/constants/pairs';
import { createCompositeKey } from 'src/common/helpers/subscriptionKey';
import { CustomLogger } from '../logger/logger.service';
import { decodeTicker } from 'src/common/helpers/marketdata/decoder';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';

export type marketDataType = 'orderbook' | 'OHLCV' | 'ticker' | 'tickers';

@Injectable()
export class MarketdataService {
  private exchange: ccxt.Exchange;
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new CustomLogger(MarketdataService.name);
  private activeSubscriptions = new Map<string, boolean>(); // Track active subscriptions

  private cachingTTL: 10; // 10s

  // cache supported pairs
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private ExchangeInitService: ExchangeInitService,
  ) {}

  async getSupportedExchanges(): Promise<string[]> {
    return this.ExchangeInitService.getSupportedExchanges();
  }

  async getTickers(exchange: string, symbols: string[]) {
    this.exchange = this.ExchangeInitService.getExchange(exchange);

    if (!this.exchange || !this.exchange.has.fetchTickers) {
      throw new Error(
        'Exchange does not support fetchTickers or is not configured.',
      );
    }
    this.logger.debug(
      `Fetching tickers from ${this.exchange.name} for ${symbols}`,
    );

    return await this.exchange.fetchTickers(symbols);
  }

  async getOHLCVData(
    exchange: string,
    symbol: string,
    timeframe = '1m',
    since?: number,
    limit = 30,
  ): Promise<any> {
    this.exchange = this.ExchangeInitService.getExchange(exchange);

    if (!this.exchange || !this.exchange.has.fetchOHLCV) {
      throw new Error(
        'Exchange does not support fetchOHLCV or is not configured.',
      );
    }
    this.logger.debug(
      `Fetching OHLCV data from ${this.exchange.name} for ${symbol}`,
    );

    const OHLCV = await this.exchange.fetchOHLCV(
      symbol,
      timeframe,
      since,
      limit,
    );
    return OHLCV.map((data) => {
      return {
        timestamp: data[0],
        open: data[1],
        close: data[2],
        high: data[3],
        low: data[4],
        volume: data[5],
      };
    });
  }

  async getSupportedPairs(): Promise<any> {
    const cacheID = `supported-pairs`;
    try {
      const cachedData = await this.cacheService.get(cacheID);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        const pairs = await this._getSupportedPairs();
        await this.cacheService.set(
          cacheID,
          JSON.stringify(pairs),
          this.cachingTTL,
        );
        return pairs;
      }
    } catch (error) {
      console.error('Error accessing cache:', error);
      const pairs = await this._getSupportedPairs();
      return pairs;
    }
  }

  async _getSupportedPairs(): Promise<any> {
    const promises = [];

    for (const [exchange, pairs] of Object.entries(SUPPORTED_PAIRS)) {
      if (pairs.length > 0) {
        const promise = this.getTickers(exchange, pairs)
          .then((tickers) => {
            return pairs.map((pair) => ({
              symbol: pair,
              price: tickers[pair]?.last, // Use optional chaining in case tickers[pair] is undefined
              change: tickers[pair]?.percentage, // Use optional chaining here as well
              exchange,
            }));
          })
          .catch((error) => {
            this.logger.error(
              `Error fetching tickers from ${exchange}: ${error.message}`,
            );
            return []; // Return an empty array for this exchange in case of error
          });
        promises.push(promise);
      } else {
        promises.push(Promise.resolve([])); // Return an empty array if there are no pairs
      }
    }

    const results = await Promise.all(promises);
    // Flatten the array of arrays into a single array
    const flattenedResults = results.flat();
    return flattenedResults;
  }

  async watchOrderBook(
    exchangeName: string,
    symbol: string,
    onData: (data: any) => void,
    limit = 14,
  ): Promise<void> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange || !exchange.has.watchOrderBook) {
      throw new Error(
        `Exchange ${exchangeName} does not support watchOrderBook or is not configured.`,
      );
    }

    const subscriptionKey = `orderbook:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    if (exchangeName === 'bitfinex') {
      limit = 25;
    }

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const orderBook = await exchange.watchOrderBook(symbol, limit);
        onData(orderBook);
      } catch (error) {
        this.logger.error(
          `Error watching order book for ${symbol} on ${exchangeName}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Reconnect after a delay
      }
    }
  }

  async watchOHLCV(
    exchangeName: string,
    symbol: string,
    onData: (data: any) => void,
    timeFrame?: string,
    since?: number,
    limit?: number,
  ): Promise<void> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange || !exchange.has.watchOHLCV) {
      throw new Error(
        `Exchange ${exchangeName} does not support watchOHLCV or is not configured.`,
      );
    }

    const subscriptionKey = `OHLCV:${exchangeName}:${symbol}:${timeFrame}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const OHLCV = await exchange.watchOHLCV(
          symbol,
          timeFrame,
          since,
          limit,
        );
        onData(OHLCV);
      } catch (error) {
        this.logger.error(
          `Error watching OHLCV for ${symbol} on ${exchangeName}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Reconnect after a delay
      }
    }
  }

  async watchTicker(
    exchangeName: string,
    symbol: string,
    onData: (data: any) => void,
  ): Promise<void> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange || !exchange.has.watchTicker) {
      throw new Error(
        `Exchange ${exchangeName} does not support watchTicker or is not configured.`,
      );
    }

    const subscriptionKey = `ticker:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const ticker = await exchange.watchTicker(symbol);
        onData(decodeTicker(exchangeName, ticker));
      } catch (error) {
        this.logger.error(
          `Error watching ticker for ${symbol} on ${exchangeName}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Reconnect after a delay
      }
    }
  }

  async watchTickers(
    exchangeName: string,
    symbol: string[],
    onData: (data: any) => void,
  ): Promise<void> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange || !exchange.has.watchTicker) {
      throw new Error(
        `Exchange ${exchangeName} does not support watchTicker or is not configured.`,
      );
    }

    const subscriptionKey = `tickers:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const ticker = await exchange.watchTickers(symbol);
        onData(ticker);
      } catch (error) {
        this.logger.error(
          `Error watching tickers for ${symbol} on ${exchangeName}: ${error.message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Reconnect after a delay
      }
    }
  }

  isSubscribed(
    type: marketDataType,
    exchangeName: string,
    symbol?: string,
    symbols?: string[],
    timeFrame?: string,
  ): boolean {
    const subscriptionKey = createCompositeKey(
      type,
      exchangeName,
      symbol,
      symbols,
      timeFrame,
    );
    return this.activeSubscriptions.has(subscriptionKey);
  }

  unsubscribeOrderBook(exchangeName: string, symbol: string): void {
    const subscriptionKey = `${exchangeName}:${symbol}`;
    this.activeSubscriptions.delete(subscriptionKey);
  }

  public async getTickerPrice(
    exchangeName: string,
    symbol: string,
  ): Promise<any> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange || !exchange.has.fetchTicker) {
      throw new Error(
        'Exchange does not support fetchTicker or is not configured.',
      );
    }
    this.logger.debug(
      `Fetching ticker price from ${exchange.name} for ${symbol}`,
    );
    return await exchange.fetchTicker(symbol); //Use Last as it represent the last price.
  }

  //optional to fetch multiple ticker prices at once
  async getMultipleTickerPrices(
    exchangeNames: string[],
    symbols: string[],
  ): Promise<any[]> {
    const fetchPromises = [];
    exchangeNames.forEach((exchangeName) => {
      symbols.forEach((symbol) => {
        const promise = this.getTickerPrice(exchangeName, symbol).catch(
          (error) => {
            this.logger.error(
              `Failed to fetch ticker for ${symbol} on ${exchangeName}: ${error.message}`,
            );
            return null; // Return null or some error indication for this failed request
          },
        );
        fetchPromises.push(promise);
      });
    });
    return Promise.all(fetchPromises);
  }

  async getSupportedSymbols(exchangeName: string): Promise<string[]> {
    const exchange = this.ExchangeInitService.getExchange(exchangeName);
    if (!exchange) {
      throw new Error(`Exchange ${exchangeName} is not configured.`);
    }
    await exchange.loadMarkets();
    return Object.keys(exchange.markets);
  }

  unsubscribeData(
    type: marketDataType,
    exchangeName: string,
    symbol?: string,
    symbols?: string[],
    timeFrame?: string,
  ): void {
    const subscriptionKey = createCompositeKey(
      type,
      exchangeName,
      symbol,
      symbols,
      timeFrame,
    );
    this.activeSubscriptions.delete(subscriptionKey);
  }
}
