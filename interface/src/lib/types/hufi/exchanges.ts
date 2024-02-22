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

export interface TickerData {
  exchange: SupportedExchanges,
  symbol: SupportedPairs,
  
}

export interface OHLCVData {
  
}

export type PairsData = {
  symbol: SupportedPairs;
  price: number;
  exchange: SupportedExchanges;
  change?: number;
}

// {
//   "symbol": "BTC/USDT",
//   "timestamp": 1707725876275,
//   "datetime": "2024-02-12T08:17:56.275Z",
//   "high": 48826.81,
//   "low": 47755.81,
//   "bid": 48144.18,
//   "bidVolume": 3.13578,
//   "ask": 48144.19,
//   "askVolume": 8.28334,
//   "vwap": 48232.70387075,
//   "open": 48238.01,
//   "close": 48144.19,
//   "last": 48144.19,
//   "previousClose": 48238,
//   "change": -93.82,
//   "percentage": -0.194,
//   "baseVolume": 30777.33764,
//   "quoteVolume": 1484474212.320176,
//   "info": {
//       "e": "24hrTicker",
//       "E": 1707725876275,
//       "s": "BTCUSDT",
//       "p": "-93.82000000",
//       "P": "-0.194",
//       "w": "48232.70387075",
//       "x": "48238.00000000",
//       "c": "48144.19000000",
//       "Q": "0.00734000",
//       "b": "48144.18000000",
//       "B": "3.13578000",
//       "a": "48144.19000000",
//       "A": "8.28334000",
//       "o": "48238.01000000",
//       "h": "48826.81000000",
//       "l": "47755.81000000",
//       "v": "30777.33764000",
//       "q": "1484474212.32017600",
//       "O": 1707639476275,
//       "C": 1707725876275,
//       "F": 3411224424,
//       "L": 3412585202,
//       "n": 1360779
//   }
// }