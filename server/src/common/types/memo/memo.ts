import {
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

// Maintain /src/common/constants/memo.ts
export type TradingType = keyof typeof TARDING_TYPE_MAP;
export type SpotOrderType = keyof typeof SPOT_ORDER_TYPE_MAP;
export type ExchangeIndex = keyof typeof SPOT_EXCHANGE_MAP;

export interface MemoDetails {
  tradingType: TradingType;
  spotOrderType: SpotOrderType;
  exchangeIndex: ExchangeIndex;
  destId: PairsMapKey;
  limitPrice?: string;
  refId: string;
}
