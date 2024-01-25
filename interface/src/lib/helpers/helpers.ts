import binance from "$lib/images/exchanges/binance.png"
import okx from "$lib/images/exchanges/okx.svg"
import gate from "$lib/images/exchanges/gate.png"
import lbank from "$lib/images/exchanges/lbank.png"
import mixinIcons from "$lib/constants/mixinIcons.json"
import emptyToken from "$lib/images/empty-token.svg"

export const EXCHANGES = ['binance', 'okx', 'gate', 'lbank']

// Input identifier from coingecko /coin/:id
export const findExchangeIconByIdentifier = (identifier: string) => {
  switch(identifier.toUpperCase()) {
    case "BINANCE": return binance
    case "OKX":
    case "OKEX": return okx
    case "GATE": return gate
    case "LBANK": return lbank
    default: return emptyToken
  }
}

// Input symbol to get Mixin image link
export const findCoinIconBySymbol = (symbol: string) => {
  return mixinIcons[symbol.toUpperCase()]
}