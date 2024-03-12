import { PAIRS_MAP, SYMBOL_ASSET_ID_MAP } from 'src/common/constants/pairs';

// e.g. Z7GC
export type PairsMapKey = keyof typeof PAIRS_MAP;

// e.g. BTC/USDT
export type PairsMapValue = (typeof PAIRS_MAP)[keyof typeof PAIRS_MAP];

// e.g. BTC
export type SymbolAssetIdMapKey = keyof typeof SYMBOL_ASSET_ID_MAP;

// e.g. c6d0c728-2624-429b-8e0d-d9d19b6592fa
export type SymbolAssetIdMapValue =
  (typeof SYMBOL_ASSET_ID_MAP)[keyof typeof SYMBOL_ASSET_ID_MAP];
