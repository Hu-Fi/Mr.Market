import { get } from "svelte/store";
import { asks, bids, buy, current, pair, usdValue } from "$lib/stores/trade";
import type { OHLCVData, OrderBookData, OrderBookPriceData, OrderBookPriceFormat, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";
import { CandlePair } from "$lib/stores/market";

const formatOrderBookPriceArray = (a: OrderBookPriceData[]): OrderBookPriceFormat[] => {
  return a.map(([price, amount]) => ({ price, amount }));
};

export const decodeOrderBook = ( exchangeName: SupportedExchanges, data: OrderBookData ) => {
  const reservedAsks = formatOrderBookPriceArray(Array.from(data.data.data.asks).reverse())
  const Bids = formatOrderBookPriceArray(data.data.data.bids)
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

export const decodeCandleTicker = ( exchangeName: SupportedExchanges, data: { data: TickerData } ) => {
  CandlePair.set(data.data);
}

export const decodeCandleOrderbook = ( exchangeName: SupportedExchanges, data: OrderBookData ) => {
  console.log('Orderbook', data)
}