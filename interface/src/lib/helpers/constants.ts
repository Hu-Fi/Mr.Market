import { env } from "$env/dynamic/public";
import type { SupportedTimeFrame } from "$lib/types/hufi/exchanges"

export const AppName = "Mr.market"
export const AppURL = env.PUBLIC_APP_URL || "https://mr-market-app.onrender.com"

export const SHOW_BAR = env.PUBLIC_SHOW_BAR === "true" ? true : false;
export const OAUTH_SCOPE = env.PUBLIC_OAUTH_SCOPE || 'PROFILE:READ ASSETS:READ SNAPSHOTS:READ'
export const MIXIN_MESSENGER_INSTALL = env.PUBLIC_MIXIN_MESSENGER_INSTALL || 'https://messenger.mixin.one/install'
export const MIXIN_API_BASE_URL = env.PUBLIC_MIXIN_API_BASE_URL || 'https://api.mixin.one'

export const MRM_SOCKET_URL = env.PUBLIC_MRM_SOCKET_URL || '//mr-market-server.onrender.com'
export const MRM_BACKEND_URL = env.PUBLIC_MRM_BACKEND_URL || 'https://mr-market-server.onrender.com'
export const HUFI_CAMPAGIN_LAUNCHER_URL = env.PUBLIC_HUFI_CAMPAGIN_LAUNCHER_URL || 'https://cl.hu.finance'
export const HUMAN_PROTOCOL_GROUP_URL = env.PUBLIC_HUMAN_PROTOCOL_GROUP_URL || 'https://mixin.one/apps/5a33fc52-f445-4170-a06a-47f8be94a8f3'

export const BALANCE_CURRENCIES = ["USDT", "USD", "EUR", "GBP", "AED", "CNY", "HKD", "JPY"]
export const BALANCE_CURRENCY_RATE_URL = "https://latest.currency-api.pages.dev/v1/currencies/usdt.json"
export const MARKET_TOKEN_EXCHANGES = ["binance", "huobi", "okex", "bybit", "bitget", "bitmex", "bitfinex", "kraken", "coinbase", "bigone"]
export const ORDER_STATE_FETCH_INTERVAL = 3000
export const ORDER_STATE_TIMEOUT_DURATION = 180000
export const HARDCODED_FEE = 1.002

// It must sync with server/pairs.ts
export const SUPPORTED_EXCHANGES = ['binance', 'okx', 'gate.io', 'mexc'];
export const SUPPORTED_TIMERANGES: SupportedTimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']

// Limit order needs 12, Market order needs 10, use 14 to avoid data loss
export const ORDERBOOK_STREAM_LENGTH = 14
export const LIMIT_ORDERBOOK_LENGTH = 12
export const MARKET_ORDERBOOK_LENGTH = 10
export const LIMIT_ORDERBOOK_HALF_LENGTH = LIMIT_ORDERBOOK_LENGTH / 2
export const MARKET_ORDERBOOK_HALF_LENGTH = MARKET_ORDERBOOK_LENGTH / 2

export const BTC_UUID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'
export const ETH_UUID = '43d61dcd-e413-450d-80b8-101d5e903357'

export const UpColorBg = "bg-green-500"
export const UpColorText = "text-green-600"
export const DownColorBg = "bg-red-500"
export const DownColorText = "text-red-600"
export const FocusUpColorBg = "focus:bg-green-500"
export const FocusDownColorBg = "focus:bg-red-500"

export const CoinsTypeTabs = [
  // {
  //   name: "favorites",
  //   id: "favorites",
  // },
  {
    name: "all",
    id: "all",
  },
  {
    name: "layer1",
    id: "layer-1",
  },
  {
    name: "layer2",
    id: "layer-2",
  },
  {
    name: "inscriptions",
    id: "inscriptions",
  },
  {
    name: "ai",
    id: "artificial-intelligence",
  },
  {
    name: "meme",
    id: "ai-meme-coins",
  },
  {
    name: "defi",
    id: "decentralized-finance-defi",
  },
  {
    name: "game_fi",
    id: "gaming",
  },
  {
    name: "nft",
    id: "non-fungible-tokens-nft",
  }
]

export const maskOption = {
  numeral: true,
  numeralDecimalMark: '.',
  numeralPositiveOnly: true,
  numeralDecimalScale: 8,
  numeralThousandsGroupStyle: 'none'
}
