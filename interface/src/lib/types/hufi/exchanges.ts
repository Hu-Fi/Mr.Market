export type SupportedExchanges = 'binance' | 'mexc' | 'bitfinex' | 'okx' | 'gate' | 'lbank' 
export type SupportedPairs = 'BTC/USDT' | 'ETH/USDT' | 'HMT/USDT'
export type OrderBookPriceData = [number, number, number?]
export type OrderBookPriceFormat = { price: number, amount: number}

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