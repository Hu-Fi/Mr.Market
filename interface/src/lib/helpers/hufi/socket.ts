import { get } from "svelte/store";
import { io } from "socket.io-client";
import { goto } from "$app/navigation";
import type { Socket } from "socket.io-client";
import { HUFI_SOCKET_URL } from "$lib/helpers/constants";
import type { MarketDataType, SupportedExchanges, TickerData } from "$lib/types/hufi/exchanges";
import { orderBookLoaded, pair, pairSelectorDialog } from "$lib/stores/trade";
import { CandleChartLoaded, CandleLoaded, CandleOrderBookLoaded, CandlePair, CandlePairSelectorDialog, CandlePriceLoaded } from "$lib/stores/market";
import { decodeCandleStick, decodeOrderBook, decodeCandleTicker, decodeCandleOrderbook } from "$lib/helpers/hufi/marketDataDecoder";

// /trade
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



// /market/candle/{EXCHANGE}/{PAIR}
export const connectCandleStick = (): Socket => {
  let socket: Socket;
  socket = io(`${HUFI_SOCKET_URL}:3012/marketdata`);

  socket.on("connect", () => {
    subscribeCandleStick(socket);
    console.log("CandleStick connected");
  });

  socket.on("disconnect", () => {
    orderBookLoaded.set(false);
    console.log("CandleStick disconnected");
  });

  socket.on("tickerData", (data) => {
    decodeCandleTicker('binance', data);
  })

  socket.on('OHLCVData', (data) => {
    CandleLoaded.set(true);
    decodeCandleStick("binance", data);
  })

  socket.on("orderBookData", (data) => {
    decodeCandleOrderbook("binance", data);
  });

  return socket;
};

export const switchCandleStickPair = (socket: Socket, pair: TickerData) => {
  unSubscribeCandleStick(socket);
  CandlePriceLoaded.set(false)
  CandleChartLoaded.set(false)
  CandleOrderBookLoaded.set(false)
  CandlePair.set(pair);
  goto(`/market/candle/${pair.exchange}/${pair.symbol.replace('/', '-')}`)
  console.log('pair:', pair)
  CandlePairSelectorDialog.set(false);
  subscribeCandleStick(socket);
}

export const subscribeCandleStick = (socket: Socket) => {
  // CandleStick
  socket.emit("subscribeOHLCV", {
    type: 'OHLCV' as MarketDataType,
    exchange: get(CandlePair).exchange as SupportedExchanges,
    symbol: `${get(CandlePair).symbol.split('/')[0]}/${get(CandlePair).symbol.split('/')[1]}`,
  });

  // Price
  socket.emit("subscribeTicker", {
    type: 'ticker' as MarketDataType,
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