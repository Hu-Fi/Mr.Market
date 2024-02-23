import { get } from "svelte/store";
import { CandleAsks, CandleBids, CandlePair } from "$lib/stores/market";
import { asks, bids, buy, current, pair, usdValue } from "$lib/stores/trade";
import type { OHLCVData, OrderBookData, OrderBookPriceFormat, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";

export const decodeOrderBook = ( exchangeName: SupportedExchanges, data: {data: OrderBookData } ) => {
  const Asks = data.data.asks
  const Bids = data.data.bids
  // Set asks and bids
  asks.set(Asks)
  bids.set(Bids)
  // Set current price
  if (get(buy)) {
    current.set(Asks[Asks.length-1].price)
    usdValue.set(Asks[Asks.length-1].price)
  } else {
    current.set(Bids[0].price)
    usdValue.set(Bids[0].price)
  }
}

export const decodeCandleStick = ( exchangeName: SupportedExchanges, data: OHLCVData ) => {
  console.log('OHLCV:',data);
}

export const decodeCandleTicker = ( exchangeName: SupportedExchanges, data: { data: TickerData } ) => {
  CandlePair.set(data.data);
}

export const decodeCandleOrderbook = ( exchangeName: SupportedExchanges, data: {data: OrderBookData } ) => {
  CandleBids.set(data.data.bids)
  CandleAsks.set(data.data.asks.reverse())
}