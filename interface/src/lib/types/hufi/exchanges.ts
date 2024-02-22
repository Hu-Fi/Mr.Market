export type SupportedExchanges = 'binance' | 'mexc' | 'bitfinex' | 'okx' | 'gate' | 'lbank' 
export type SupportedPairs = 'BTC/USDT' | 'ETH/USDT' | 'HMT/USDT' | 'BNB/USDT' | 'UNI/USDT' | 'CRV/USDT' | 'SOL/USDT' | 'SUI/USDT'
export type OrderBookPriceData = [number, number, number?]
export type OrderBookPriceFormat = { price: number, amount: number}
export type MarketDataType = 'orderbook' | 'OHLCV' | 'ticker' | 'tickers';

export interface OrderBookData {
  exchange: SupportedExchanges,
  symbol: SupportedPairs,
  data: {
    exchange: SupportedExchanges,
    symbol: SupportedPairs,
    data: {
      bids: OrderBookPriceData[],
      asks: OrderBookPriceData[],
      timestamp?: number,
      datetime?: string,
      nonce?: number,
    },
  },
}

export interface PairsData {
  symbol: SupportedPairs;
  price: number;
  exchange: SupportedExchanges;
  change?: number;
}

export interface TickerData extends PairsData {
  info?: {
      high: number,
      low: number,
      volume: number,
  }
}

export interface OHLCVData {
  
}