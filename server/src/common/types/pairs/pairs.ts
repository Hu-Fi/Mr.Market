import { PAIRS_MAP } from 'src/common/constants/pairs';

export type PairsMapKey = keyof typeof PAIRS_MAP;
export type PairsMapValue = (typeof PAIRS_MAP)[keyof typeof PAIRS_MAP];
