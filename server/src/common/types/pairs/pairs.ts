import { PAIRS_MAP } from 'src/common/constants/pairs';

// e.g. Z7GC
export type PairsMapKey = keyof typeof PAIRS_MAP;
// e.g. BTC/USDT
export type PairsMapValue = (typeof PAIRS_MAP)[keyof typeof PAIRS_MAP];
