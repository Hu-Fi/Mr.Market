import { get } from "svelte/store";
import { asks, bids, buy, current, pair, usdValue } from "$lib/stores/trade";
import { ORDERBOOK_STREAM_LENGTH } from "$lib/helpers/constants";
import type { OHLCVData, OrderBookData, OrderBookPriceData, OrderBookPriceFormat, SupportedExchanges } from "$lib/types/hufi/exchanges";

const formatOrderBookPriceArray = (a: OrderBookPriceData[]): OrderBookPriceFormat[] => {
  return a.map(([price, amount]) => ({ price, amount }));
};

export const decodeOrderBook = ( exchangeName: SupportedExchanges, data: OrderBookData ) => {
  const reservedAsks = formatOrderBookPriceArray(Array.from(data.data.data.asks).reverse())
  const Bids = formatOrderBookPriceArray(data.data.data.bids)
  if (reservedAsks.length != ORDERBOOK_STREAM_LENGTH ) {
    console.log('asks:', reservedAsks.length)
    console.log(reservedAsks)
  }
  if (Bids.length != ORDERBOOK_STREAM_LENGTH) {
    console.log('bids:', Bids.length) 
    console.log(Bids)
  }
  // Set asks and bids
  asks.set(reservedAsks)
  bids.set(Bids)
  // Set current price
  if (get(buy)) {
    current.set(reservedAsks[reservedAsks.length-1].price)
    usdValue.set(reservedAsks[reservedAsks.length-1].price)
  } else {
    current.set(Bids[0].price)
    usdValue.set(Bids[0].price)
  }
}

export const decodeCandleStick = ( exchangeName: SupportedExchanges, data: OHLCVData ) => {
  console.log('OHLCV:',data);
}