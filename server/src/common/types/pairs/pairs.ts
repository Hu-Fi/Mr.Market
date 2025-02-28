import { SYMBOL_ASSET_ID_MAP } from 'src/common/constants/pairs';

// e.g. BTC
export type SymbolAssetIdMapKey = keyof typeof SYMBOL_ASSET_ID_MAP;

// e.g. c6d0c728-2624-429b-8e0d-d9d19b6592fa
export type SymbolAssetIdMapValue =
  (typeof SYMBOL_ASSET_ID_MAP)[keyof typeof SYMBOL_ASSET_ID_MAP];
