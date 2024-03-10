import type { SupportedExchanges, SupportedPairs, SupportedTimeFrame } from "$lib/types/hufi/exchanges"
import { env } from '$env/dynamic/public';

export const AppName = "Mr.market"
export const AppURL = env.PUBLIC_APP_URL || "https://mr-market-one.vercel.app"

export const SHOW_BAR = env.PUBLIC_SHOW_BAR || true
export const BOT_ID = env.PUBLIC_BOT_ID || '3fb68263-4f06-476e-83db-503d25d56b93'
export const OAUTH_SCOPE = env.PUBLIC_OAUTH_SCOPE || 'PROFILE:READ ASSETS:READ SNAPSHOTS:READ'
export const MIXIN_MESSENGER_INSTALL = env.PUBLIC_MIXIN_MESSENGER_INSTALL || 'https://messenger.mixin.one/install'
export const MIXIN_API_BASE_URL = env.PUBLIC_MIXIN_API_BASE_URL || 'https://api.mixin.one'

export const HUFI_SOCKET_URL = env.PUBLIC_HUFI_SOCKET_URL || '//bc6e1fa0-3c5a-4235-809c-c4fcc4a5d859.mvg.fi'
export const HUFI_BACKEND_URL = env.PUBLIC_HUFI_BACKEND_URL || 'https://bc6e1fa0-3c5a-4235-809c-c4fcc4a5d859.mvg.fi:3000'
export const HUMAN_PROTOCOL_GROUP_URL = env.PUBLIC_HUMAN_PROTOCOL_GROUP_URL || 'https://mixin.one/apps/5a33fc52-f445-4170-a06a-47f8be94a8f3'

export const SUPPORTED_PAIRS: {
  [k in SupportedExchanges]: SupportedPairs[]
} = {
  'binance': [
    'BTC/USDT',
    'ETH/USDT',
    'BNB/USDT',
    'UNI/USDT',
    'CRV/USDT',
    'SOL/USDT',
    'SUI/USDT',
  ],
  'bitfinex': [
    'BTC/USDT',
    'ETH/USDT',
  ],
  'mexc': [
    'BTC/USDT',
    'ETH/USDT',
    'BNB/USDT',
    'UNI/USDT',
  ],
  'gate': [],
  'lbank': [],
  'okx': [],
}
export const SUPPORTED_UNIQUE_PAIRS: string[] = Array.from(new Set(Object.values(SUPPORTED_PAIRS).flatMap(pairs => pairs)));
export const SUPPORTED_EXCHANGES = Object.keys(SUPPORTED_PAIRS);
export const SUPPORTED_TIMERANGES: SupportedTimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']

// Limit needs 12, Market needs 10, use 14 to avoid data loss
export const ORDERBOOK_STREAM_LENGTH = 14
export const LIMIT_ORDERBOOK_LENGTH = 12
export const MARKET_ORDERBOOK_LENGTH = 10
export const LIMIT_ORDERBOOK_HALF_LENGTH = LIMIT_ORDERBOOK_LENGTH / 2
export const MARKET_ORDERBOOK_HALF_LENGTH = MARKET_ORDERBOOK_LENGTH / 2

export const BTC_UUID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'

export const UpColorBg = "bg-green-500"
export const UpColorText = "text-green-600"
export const DownColorBg = "bg-red-500"
export const DownColorText = "text-red-600"
export const FocusUpColorBg = "focus:bg-green-500"
export const FocusDownColorBg = "focus:bg-red-500"

export const CoinsTypeTabs = ["favorites", "all", "mainstream", "layer1", "layer2", "inscription", "ai", "meme", "defi", "game_fi", "nft"]

export const maskOption = {
  numeral: true,
  numeralDecimalMark: '.',
  numeralPositiveOnly: true,
  numeralDecimalScale: 8,
  numeralThousandsGroupStyle: 'none'
}