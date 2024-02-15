import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { HUFI_SOCKET_URL } from "$lib/helpers/constants";
import { decodeOrderBook } from "$lib/helpers/hufi/marketDataDecoder";
import { asks, bids, orderBookLoaded, pair, pairSelectorDialog, socket } from "$lib/stores/trade";
import { get } from "svelte/store";

export const connectOrderBook = (): Socket => {
  let socket: Socket;
  // Initialize the socket connection if it's not already established

  socket = io(`${HUFI_SOCKET_URL}:3012/marketdata`);

  socket.on("connect", () => {
    subscribeOrderBook(socket);
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    orderBookLoaded.set(false);
    console.log("Socket disconnected");
  });

  socket.on("orderBookData", (data) => {
    orderBookLoaded.set(true)
    decodeOrderBook("binance", data);
  });

  return socket;
};

export const subscribeOrderBook = (socket: Socket) => {
  socket.emit("subscribeOrderBook", {
    exchange: get(pair).exchange,
    symbol: `${get(pair).first}/${get(pair).second}`,
  });
}

export const unSubscribeOrderBook = (socket: Socket) => {
  socket.emit("unsubscribeData", {
    type: 'orderbook',
    exchange: get(pair).exchange,
    symbol: `${get(pair).first}/${get(pair).second}`,
  })
}

export const switchPair = (socket: Socket, c: any) => {
  unSubscribeOrderBook(socket);
  orderBookLoaded.set(false);
  pair.set(c);
  pairSelectorDialog.set(false);
  subscribeOrderBook(socket)
}