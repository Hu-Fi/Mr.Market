import { get } from "svelte/store";
import { io } from "socket.io-client";
import { goto } from "$app/navigation";
import type { Socket } from "socket.io-client";
import { MRM_SOCKET_URL } from "$lib/helpers/constants";
import { fetchCandleChartData } from "$lib/helpers/candle/candle";
import { orderBookLoaded, pair, pairSelectorDialog } from "$lib/stores/spot";
import type { CandleTab, MarketDataType, PairsData, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";
import { CandleChartLoaded, CandleOrderBookLoaded, CandlePriceLoaded, CandlePair, CandlePairSelectorDialog, CandleTimeRange, CandleLoadingFailed } from "$lib/stores/market";
import { decodeCandleStick, decodeOrderBook, decodeCandleTicker, decodeCandleOrderbook } from "$lib/helpers/mrm/marketDataDecoder";

// /spot
export const connectOrderBook = (): Socket => {
  const socket = io(`${MRM_SOCKET_URL}/market`);

  socket.on("connect", () => {
    subscribeOrderBook(socket);
    console.log("Orderbook connected");
  });

  socket.on("disconnect", () => {
    orderBookLoaded.set(false);
    console.log("Orderbook disconnected");
  });

  socket.on("orderBookData", (data) => {
    orderBookLoaded.set(true);
    decodeOrderBook(data);
  });

  return socket;
};

export const subscribeOrderBook = (socket: Socket) => {
  socket.emit("subscribeOrderBook", {
    exchange: get(pair).exchange,
    symbol: `${get(pair).symbol.split('/')[0]}/${get(pair).symbol.split('/')[1]}`,
  });
}

export const unSubscribeOrderBook = (socket: Socket) => {
  socket.emit("unsubscribeData", {
    type: 'orderbook' as MarketDataType,
    exchange: get(pair).exchange,
    symbol: `${get(pair).symbol.split('/')[0]}/${get(pair).symbol.split('/')[1]}`,
  })
}

export const switchSpotPair = (socket: Socket, p: PairsData) => {
  unSubscribeOrderBook(socket);
  orderBookLoaded.set(false);
  pair.set(p);
  goto(`/spot/${p.exchange}/${p.symbol.replace('/', '-')}`)
  pairSelectorDialog.set(false);
  subscribeOrderBook(socket)
}



// /market/candle/{EXCHANGE}/{PAIR}
export const connectCandleStick = (): Socket => {
  const socket = io(`${MRM_SOCKET_URL}/market`);

  socket.on("connect", () => {
    subscribeCandleStick(socket);
    console.log("CandleStick connected");
  });

  socket.on("disconnect", () => {
    orderBookLoaded.set(false);
    CandleChartLoaded.set(false);
    CandleOrderBookLoaded.set(false);
    CandlePriceLoaded.set(false);
    console.log("CandleStick disconnected");
  });

  socket.on("tickerData", (data) => {
    CandlePriceLoaded.set(true);
    decodeCandleTicker(data);
  })

  socket.on('OHLCVData', (data) => {
    decodeCandleStick(data);
  })

  socket.on("orderBookData", (data) => {
    CandleOrderBookLoaded.set(true);
    decodeCandleOrderbook(data);
  });

  return socket;
};

export const switchCandleStickPair = (socket: Socket, pair: TickerData) => {
  unSubscribeCandleStick(socket);
  CandlePriceLoaded.set(false)
  CandleChartLoaded.set(false)
  CandleOrderBookLoaded.set(false)
  CandleLoadingFailed.set(false)
  CandlePair.set(pair);
  goto(`/market/candle/${pair.exchange}/${pair.symbol.replace('/', '-')}`)
  CandlePairSelectorDialog.set(false);
  subscribeCandleStick(socket);
}

export const switchCandleStickTimeFrame = async (socket: Socket, timeFrame: CandleTab) => {
  // Unsubscribe WatchOHLCV
  unSubscribeCandleStick(socket);
  CandleTimeRange.set(timeFrame);
  // CandlePriceLoaded.set(false);
  CandleChartLoaded.set(false);
  // CandleOrderBookLoaded.set(false);
  CandlePairSelectorDialog.set(false);
  // Subscribe WatchOHLCV
  subscribeCandleStick(socket);
  // Return fetchOHLCV data
  try {
    return await fetchCandleChartData();
  } catch (e) {
    CandleLoadingFailed.set(true);
    console.log('CandleLoadingFailed.set(true)')
    console.error(e)
  }
}

export const subscribeCandleStick = (socket: Socket) => {
  // CandleStick
  socket.emit("subscribeOHLCV", {
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
    timeFrame: `${get(CandleTimeRange).v}`,
  });

  // Price
  socket.emit("subscribeTicker", {
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
  });

  // OrderBook
  socket.emit("subscribeOrderBook", {
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
  });
}

export const unSubscribeCandleStick = (socket: Socket) => {
  socket.emit("unsubscribeData", {
    type: 'OHLCV' as MarketDataType,
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
    timeFrame: `${get(CandleTimeRange).v}`,
  })

  socket.emit("unsubscribeData", {
    type: 'ticker' as MarketDataType,
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
  });

  socket.emit("unsubscribeData", {
    type: 'orderbook' as MarketDataType,
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
  });
}