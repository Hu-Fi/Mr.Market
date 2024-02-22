import { get } from "svelte/store";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { HUFI_SOCKET_URL } from "$lib/helpers/constants";
import { CandleLoaded, CandlePair, CandlePairSelectorDialog } from "$lib/stores/market";
import type { MarketDataType } from "$lib/types/hufi/exchanges";
import { orderBookLoaded, pair, pairSelectorDialog } from "$lib/stores/trade";
import { decodeCandleStick, decodeOrderBook } from "$lib/helpers/hufi/marketDataDecoder";

export const connectOrderBook = (): Socket => {
  let socket: Socket;
  socket = io(`${HUFI_SOCKET_URL}:3012/marketdata`);

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
    decodeOrderBook("binance", data);
  });

  return socket;
};

export const connectCandleStick = (): Socket => {
  let socket: Socket;
  socket = io(`${HUFI_SOCKET_URL}:3012/marketdata`);

  socket.on("connect", () => {
    subscribeOHLCV(socket);
    console.log("CandleStick connected");
  });

  socket.on("disconnect", () => {
    orderBookLoaded.set(false);
    console.log("CandleStick disconnected");
  });

  socket.on('subscribeOHLCV', (data) => {
    CandleLoaded.set(true);
    decodeCandleStick("binance", data);
  })

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

export const switchSpotPair = (socket: Socket, c: any) => {
  unSubscribeOrderBook(socket);
  orderBookLoaded.set(false);
  pair.set(c);
  pairSelectorDialog.set(false);
  subscribeOrderBook(socket)
}

export const switchCandleStickPair = () => {
  CandlePairSelectorDialog.set(false);
}

export const subscribeOHLCV = (socket: Socket) => {
  socket.emit("subscribeOHLCV", {
    type: 'OHLCV' as MarketDataType,
    exchange: get(CandlePair).exchange,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[0]}`,
  });
}

export const unSubscribeOHLCV = (socket: Socket) => {
  socket.emit("unsubscribeData", {
    type: 'OHLCV' as MarketDataType,
    exchange: get(CandlePair).exchange,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[0]}`,
  })
}