// This is the fallback value of minimum balance for rebalancing when it's not found in db
export const DEFAULT_MINIMUM_BALANCE = '10000';
export const MIXIN_OAUTH_URL = 'https://api.mixin.one/oauth/token';
export const MIXIN_API_BASE_URL = 'https://api.mixin.one';
export const MIXIN_DEPOSIT_FEES = {
  // USD 3
  '43d61dcd-e413-450d-80b8-101d5e903357': 3, // Ethereum
  'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 3, // Bitcoin

  // USD 0.1
  'b7938396-3f94-4e0a-9179-d3440718156f': 0.1, // Polygon (PoS)
  '1949e683-6a08-49e2-b087-d6b72398588f': 0.1, // BSC
  '3fb612c5-6844-3979-ae4a-5a84e79da870': 0.1, // Base
  '76c802a2-7c88-447f-a93e-c29c9e5dd9c8': 0.1, // Litecoin
  '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': 0.1, // Dogecoin
  'c996abc9-d94e-4494-b1cf-2a3fd3ac5714': 0.1, // Zcash
  '64692c23-8971-4cf4-84a7-4dd1271dd887': 0.1, // Solana
  '05c5ac01-31f9-4a69-aa8a-ab796de1d041': 0.1, // Monero
  '25dabac5-056a-48ff-b9f9-f67395dc407c': 0.1, // TRON
  'ef660437-d915-4e27-ad3f-632bfb6ba0ee': 0.1, // TON

  // USD 0.01
  '6cfe566e-4aad-470b-8c9a-2fd35b49c68d': 0.01, // EOS
  'eea900a8-b327-488c-8d8d-1428702fe240': 0.01, // MobileCoin
  '23dfb5a5-5d7b-48b6-905f-3970e3176e27': 0.01, // Ripple
};
