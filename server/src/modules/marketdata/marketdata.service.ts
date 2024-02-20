import { Injectable, Logger } from '@nestjs/common';
import * as ccxt from 'ccxt';

export type marketDataType = 'orderbook' | 'OHLCV' | 'ticker' | 'tickers'

@Injectable()
export class MarketdataService {
  private exchange: ccxt.Exchange;
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new Logger(MarketdataService.name);
  private activeSubscriptions = new Map<string, boolean>(); // Track active subscriptions

  constructor(
  ) {
    this.initializeExchange();
  }

  private initializeExchange() {
    // Initialize exchanges
    this.exchanges.set('bitfinex', new ccxt.pro.bitfinex({ apiKey: process.env.BITFINEX_API_KEY, secret: process.env.BITFINEX_SECRET }));
    this.exchanges.set('mexc', new ccxt.pro.mexc({ apiKey: process.env.MEXC_API_KEY, secret: process.env.MEXC_SECRET }));
    this.exchanges.set('binance', new ccxt.pro.binance({ apiKey: process.env.BINANCE_API_KEY, secret: process.env.BINANCE_SECRET }))
  }

  async getTickers(exchange: string, symbols: string[]) {
    this.exchange = this.exchanges.get(exchange);

    if (!this.exchange || !this.exchange.has.fetchTickers) {
      throw new Error('Exchange does not support fetchTickers or is not configured.');
    }
    this.logger.log(`Fetching tickers from ${this.exchange.name} for ${symbols}`)
    
    return await this.exchange.fetchTickers(symbols);
  }

  async getOHLCVData(exchange: string, symbol: string, timeframe: string = '1m', since?: number, limit: number = 30): Promise<any> {
    this.exchange = this.exchanges.get(exchange);

    if (!this.exchange || !this.exchange.has.fetchOHLCV) {
      throw new Error('Exchange does not support fetchOHLCV or is not configured.');
    }
    this.logger.log(`Fetching OHLCV data from ${this.exchange.name} for ${symbol}`)

    return await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
  }

  async watchOrderBook(exchangeName: string, symbol: string, onData: (data: any) => void, limit: number = 25): Promise<void> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange || !exchange.has.watchOrderBook) {
      throw new Error(`Exchange ${exchangeName} does not support watchOrderBook or is not configured.`);
    }

    const subscriptionKey = `orderbook:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const orderBook = await exchange.watchOrderBook(symbol, limit);
        onData(orderBook);
      } catch (error) {
        this.logger.error(`Error watching order book for ${symbol} on ${exchangeName}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));  // Reconnect after a delay
      }
    }
  }

  async watchOHLCV(exchangeName: string, symbol: string, onData: (data: any) => void): Promise<void> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange || !exchange.has.watchOHLCV) {
      throw new Error(`Exchange ${exchangeName} does not support watchOHLCV or is not configured.`);
    }

    const subscriptionKey = `OHLCV:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const OHLCV = await exchange.watchOHLCV(symbol);
        onData(OHLCV);
      } catch (error) {
        this.logger.error(`Error watching OHLCV for ${symbol} on ${exchangeName}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));  // Reconnect after a delay
      }
    }
  }

  async watchTicker(exchangeName: string, symbol: string, onData: (data: any) => void): Promise<void> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange || !exchange.has.watchTicker) {
      throw new Error(`Exchange ${exchangeName} does not support watchTicker or is not configured.`);
    }

    const subscriptionKey = `ticker:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const ticker = await exchange.watchTicker(symbol);
        onData(ticker);
      } catch (error) {
        this.logger.error(`Error watching ticker for ${symbol} on ${exchangeName}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));  // Reconnect after a delay
      }
    }
  }

  async watchTickers(exchangeName: string, symbol: string[], onData: (data: any) => void): Promise<void> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange || !exchange.has.watchTicker) {
      throw new Error(`Exchange ${exchangeName} does not support watchTicker or is not configured.`);
    }

    const subscriptionKey = `tickers:${exchangeName}:${symbol}`;
    this.activeSubscriptions.set(subscriptionKey, true);

    while (this.activeSubscriptions.get(subscriptionKey)) {
      try {
        const ticker = await exchange.watchTickers(symbol);
        onData(ticker);
      } catch (error) {
        this.logger.error(`Error watching tickers for ${symbol} on ${exchangeName}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000));  // Reconnect after a delay
      }
    }
  }

  isSubscribed(type: marketDataType, exchangeName: string, symbol?: string, symbols?: string[]): boolean {
    let subscriptionKey = '';
    
    if (type === 'orderbook' || type === 'OHLCV' || type === 'ticker') {
      // Handle both single symbol and array of symbols for these types
      const symbolKey = Array.isArray(symbol) ? symbol.join(':') : symbol;
      subscriptionKey = `${type}:${exchangeName}:${symbolKey}`;
    } else if (type === 'tickers') {
      // Ensure symbols is an array and sort it to create a consistent key
      const symbolsKey = Array.isArray(symbols) ? symbols.sort().join(':') : symbols;
      subscriptionKey = `tickers:${exchangeName}:${symbolsKey}`;
    }
  
    return this.activeSubscriptions.has(subscriptionKey);
  }

  unsubscribeData(type: marketDataType,exchangeName: string, symbol?: string, symbols?: string[]): void {
    let subscriptionKey = '';
    switch (type) {
      case 'orderbook':
      case 'OHLCV':
      case 'ticker':
        subscriptionKey = `${type}:${exchangeName}:${symbol}`;
        break;
      case 'tickers':
        subscriptionKey = `orderbook:${exchangeName}:${symbols}`;
        break;
    }
    this.activeSubscriptions.delete(subscriptionKey);
  }
}
