import { get } from "svelte/store";
import { asks, bids, buy, current, usdValue } from "$lib/stores/spot";
import { CandleAsks, CandleBids, CandleChartLoaded, CandleNewData, CandleOrderBookLoaded, CandlePair, CandlePriceLoaded } from "$lib/stores/market";
import type { OHLCVData, OrderBookData, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";
import { LIMIT_ORDERBOOK_LENGTH } from "../constants";

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

export const decodeCandleStick = ( exchangeName: SupportedExchanges, data: {data: OHLCVData} ) => {
  CandleChartLoaded.set(true)
  CandleNewData.set(data.data);
}

export const decodeCandleTicker = ( exchangeName: SupportedExchanges, data: { data: TickerData } ) => {
  CandlePriceLoaded.set(true);
  CandlePair.set(data.data);
}

export const decodeCandleOrderbook = ( exchangeName: SupportedExchanges, data: {data: OrderBookData } ) => {
  CandleOrderBookLoaded.set(true);
  if (!data.data.bids || !data.data.asks) {
    return
  }
  // Cut orderbook length
  if (data.data.bids.length >= LIMIT_ORDERBOOK_LENGTH) {
    CandleBids.set(data.data.bids.slice(0, LIMIT_ORDERBOOK_LENGTH))
  } else {
    CandleBids.set(data.data.bids)
  }
  if (data.data.asks.length >= LIMIT_ORDERBOOK_LENGTH) {
    CandleAsks.set(data.data.asks.reverse().slice(0, LIMIT_ORDERBOOK_LENGTH))
  } else {
    CandleBids.set(data.data.asks)
  }
}