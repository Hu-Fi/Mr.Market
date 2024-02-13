import { asks, bids, buy, current, pair } from "$lib/stores/trade";
import { ORDERBOOK_STREAM_LENGTH } from "$lib/helpers/constants";
import type { OrderBookData, OrderBookPriceData, OrderBookPriceFormat, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";
import { get } from "svelte/store";

const formatOrderBookPriceArray = (a: OrderBookPriceData[]): OrderBookPriceFormat[] => {
  return a.map(([price, amount]) => ({ price, amount }));
};

export const decodeOrderBook = ( exchangeName: SupportedExchanges, data: OrderBookData) => {
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
  asks.set(reservedAsks)
  bids.set(Bids)
}

export const decodeTicker = ( exchangeName: SupportedExchanges, data: TickerData) => {
  if (get(buy)) {
    current.set(data.data.data.ask)
  } else {
    current.set(data.data.data.bid)
  }
  // pair.percentage = data.data.percentage
}