export type SupportedExchanges = 'binance' | 'mexc' | 'bitfinex' | 'okx' | 'gate' | 'lbank' 
export type SupportedPairs = 'BTC/USDT' | 'ETH/USDT' | 'HMT/USDT' | 'BNB/USDT' | 'UNI/USDT' | 'CRV/USDT' | 'SOL/USDT' | 'SUI/USDT'
export type SupportedTimeFrame = '1s' | '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '24h' | '1d' | '2d' | '3d' | '5d' | '1w' | '1M' | '3M'
export type OrderBookPriceData = [number, number, number?]
export type OrderBookPriceFormat = { price: number, amount: number}
export type MarketDataType = 'orderbook' | 'OHLCV' | 'ticker' | 'tickers';
export type CandleTabs = {k:string, v: SupportedTimeFrame}[]

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
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}