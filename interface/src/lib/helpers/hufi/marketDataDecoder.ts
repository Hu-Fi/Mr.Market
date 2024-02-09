import { asks, bids, current } from "$lib/stores/trade";
import type { OrderBookData, OrderBookPriceData, OrderBookPriceFormat, SupportedExchanges } from "$lib/types/hufi/exchanges";

const formatOrderBookPriceArray = (a: OrderBookPriceData[], asks: boolean = false): OrderBookPriceFormat[] => {
  return asks ? a.reverse().map(([price, amount]) => ({ price, amount })) : a.map(([price, amount]) => ({ price, amount }));
};

export const decodeOrderBook = ( exchangeName: SupportedExchanges, data: OrderBookData) => {
  asks.set(formatOrderBookPriceArray(data.data.data.asks, true))
  bids.set(formatOrderBookPriceArray(data.data.data.bids, false))
}