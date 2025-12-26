import { get } from "svelte/store";
import { LIMIT_ORDERBOOK_LENGTH } from "$lib/helpers/constants";
import { asks, bids, buy, current, usdValue } from "$lib/stores/spot";
import type { OHLCVData, OrderBookData, TickerData } from "$lib/types/hufi/exchanges";
import { CandleAsks, CandleBids, CandleChartLoaded, CandleNewData, CandleOrderBookLoaded, CandlePair, CandlePriceLoaded } from "$lib/stores/market";

export const decodeOrderBook = ( data: {data: OrderBookData } ) => {
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

export const decodeCandleStick = ( data: {data: OHLCVData} ) => {
  CandleChartLoaded.set(true)
  if (data && data.data) {
    CandleNewData.set(data.data);
  } else {
    console.error('Invalid data received for CandleNewData');
  }
}

export const decodeCandleTicker = ( data: { data: TickerData } ) => {
  CandlePriceLoaded.set(true);
  CandlePair.set(data.data);
}

export const decodeCandleOrderbook = ( data: {data: OrderBookData } ) => {
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