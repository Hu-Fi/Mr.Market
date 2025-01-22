import { get } from "svelte/store";
import { io } from "socket.io-client";
import { goto } from "$app/navigation";
import type { Socket } from "socket.io-client";
import { HUFI_SOCKET_URL } from "$lib/helpers/constants";
import { fetchCandleChartData } from "$lib/helpers/candle/candle";
import { orderBookLoaded, pair, pairSelectorDialog } from "$lib/stores/spot";
import type { CandleTab, MarketDataType, PairsData, TickerData } from "$lib/types/hufi/exchanges";
import { CandleChartLoaded, CandleOrderBookLoaded, CandlePriceLoaded, CandlePair, CandlePairSelectorDialog, CandleTimeRange, CandleLoadingFailed } from "$lib/stores/market";
import { decodeCandleStick, decodeOrderBook, decodeCandleTicker, decodeCandleOrderbook } from "$lib/helpers/hufi/marketDataDecoder";

// When open /spot, this function will be called to connect socket
export const connectOrderBook = (): Socket => {
  const socket = io(`${HUFI_SOCKET_URL}/marketdata`);

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
  const p = get(pair)
  socket.emit("subscribeOrderBook", {
    exchange: p.exchange_id,
    symbol: `${p.symbol.split('/')[0]}/${p.symbol.split('/')[1]}`,
  });
}

export const unSubscribeOrderBook = (socket: Socket) => {
  const p = get(pair)
  socket.emit("unsubscribeData", {
    type: 'orderbook' as MarketDataType,
    exchange: p.exchange_id,
    symbol: `${p.symbol.split('/')[0]}/${p.symbol.split('/')[1]}`,
  })
}

export const switchSpotPair = (socket: Socket, p: Partial<PairsData>) => {
  unSubscribeOrderBook(socket);
  orderBookLoaded.set(false);
  pair.set(p);
  goto(`/spot/${p.exchange_id}/${p.symbol?.replace('/', '-') || ''}`)
  pairSelectorDialog.set(false);
  subscribeOrderBook(socket)
}



// When open /market/candle/{EXCHANGE}/{PAIR}, this function will be called to connect socket
export const connectCandleStick = (): Socket => {
  const socket = io(`${HUFI_SOCKET_URL}/marketdata`);

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

export const switchCandleStickPair = (socket: Socket, pair: Partial<TickerData>) => {
  if (!pair.exchange_id || !pair.symbol) {
    console.error('Invalid pair');
    return;
  }
  unSubscribeCandleStick(socket);
  CandlePriceLoaded.set(false)
  CandleChartLoaded.set(false)
  CandleOrderBookLoaded.set(false)
  CandleLoadingFailed.set(false)
  CandlePair.set(pair);
  goto(`/market/candle/${pair.exchange_id}/${pair.symbol.replace('/', '-')}`)
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
  const p = get(CandlePair)
  if (!p.symbol || !p.exchange_id) {
    return;
  }
  const exchange = p.exchange_id
  const symbol = `${p.symbol?.split('/')[0]}/${p.symbol?.split('/')[1]}`
  const timeFrame = `${get(CandleTimeRange).v}`
  
  // CandleStick
  socket.emit("subscribeOHLCV", {
    exchange,
    symbol,
    timeFrame,
  });

  // Price
  socket.emit("subscribeTicker", {
    exchange,
    symbol,
  });

  // OrderBook
  socket.emit("subscribeOrderBook", {
    exchange,
    symbol,
  });
}

export const unSubscribeCandleStick = (socket: Socket) => {
  const p = get(CandlePair)
  const exchange = p.exchange_id
  const symbol = `${p.symbol?.split('/')[0]}/${p.symbol?.split('/')[1]}`
  const timeFrame = `${get(CandleTimeRange).v}`

  socket.emit("unsubscribeData", {
    type: 'OHLCV' as MarketDataType,
    exchange,
    symbol,
    timeFrame,
  })

  socket.emit("unsubscribeData", {
    type: 'ticker' as MarketDataType,
    exchange,
    symbol,
  });

  socket.emit("unsubscribeData", {
    type: 'orderbook' as MarketDataType,
    exchange,
    symbol,
  });
}