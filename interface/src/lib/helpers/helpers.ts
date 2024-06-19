import binance from "$lib/images/exchanges/binance.jpg";
import bingx from "$lib/images/exchanges/bingx.jpg";
import bitfinex from "$lib/images/exchanges/bitfinex.png";
import bitget from "$lib/images/exchanges/bitget.jpg";
import bithumb from "$lib/images/exchanges/bithumb.png";
import bitmart from "$lib/images/exchanges/bitmart.png";
import bitrue from "$lib/images/exchanges/bitrue.png";
import bitvenus from "$lib/images/exchanges/bitvenus.png";
import bybit from "$lib/images/exchanges/bybit.png";
import coinbase from "$lib/images/exchanges/coinbase.png";
import df from "$lib/images/exchanges/df.png";
import gate from "$lib/images/exchanges/gate.jpg";
import hotcoin from "$lib/images/exchanges/hotcoin.jpg";
import htx from "$lib/images/exchanges/htx.png";
import kraken from "$lib/images/exchanges/kraken.jpg";
import kucoin from "$lib/images/exchanges/kucoin.png";
import lbank from "$lib/images/exchanges/lbank.png";
import mexc from "$lib/images/exchanges/mexc.jpeg";
import okx from "$lib/images/exchanges/okx.svg";
import p2b from "$lib/images/exchanges/p2b.jpeg";
import upbit from "$lib/images/exchanges/upbit.png";
import whitebit from "$lib/images/exchanges/whitebit.jpg";
import cryptocom from "$lib/images/exchanges/cryptocom.png";
import bigone from "$lib/images/exchanges/bigone.png";
import tapbit from "$lib/images/exchanges/tapbit.png";
import emptyToken from "$lib/images/empty-token.svg";
import mixinIcons from "$lib/constants/mixinIcons.json";
import type { Page } from "@sveltejs/kit";

// Input identifier from coingecko /coin/:id
export const findExchangeIconByIdentifier = (identifier: string) => {
  switch(identifier.toUpperCase()) {
    case "BINANCE": return binance;
    case "BINGX": return bingx;
    case "BITFINEX": return bitfinex;
    case "BITGET": return bitget;
    case "BITHUMB": return bithumb;
    case "BITMART": return bitmart;
    case "BITRUE": return bitrue;
    case "BITVENUS": return bitvenus;
    case "BYBIT_SPOT":
    case "BYBIT": return bybit;
    case "GDAX":
    case "COINBASE": return coinbase;
    case "DF": return df;
    case "GATE": return gate;
    case "HOTCOIN": return hotcoin;
    case "HUOBI":
    case "HTX": return htx;
    case "KRAKEN": return kraken;
    case "KUCOIN": return kucoin;
    case "LBANK": return lbank;
    case "MXC":
    case "MEXC": return mexc;
    case "OKX":
    case "OKEX": return okx;
    case "P2PB2B":
    case "P2B": return p2b;
    case "UPBIT": return upbit;
    case "WHITEBIT": return whitebit;
    case "CRYPTO_COM": return cryptocom;
    case "BIGONE": return bigone;
    case "TAPBIT": return tapbit;
    default: 
      // console.log(identifier);
      return emptyToken;
  }
}

// Input symbol to get Mixin image link
export const findCoinIconBySymbol = (symbol: string) => {
  // @ts-expect-error ingore import from json file
  return mixinIcons[symbol.toUpperCase()];
}

export const growPathChecker = ($page: Page, type: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const pathSegments = $page.url.pathname.split('/').filter(Boolean);
    return pathSegments.length === 3 && pathSegments[0] === 'grow' && pathSegments[1] === type && uuidRegex.test(pathSegments[2]);
};