import { PairsMapKey } from '../pairs/pairs';

export type TradingType = 'SP' | 'SW' | 'MM' | 'AR' | 'LE' | 'PE';
export type SpotOrderType = 'LB' | 'LS' | 'MB' | 'MS';
export type ExchangeIndex = '01' | '02' | '03' | '04';
// spotExchangeMap in /src/common/constants/memo.ts

export interface MemoDetails {
  tradingType: TradingType;
  spotOrderType: SpotOrderType;
  exchange: ExchangeIndex;
  destId: PairsMapKey;
  limitPrice?: string;
  refId: string;
}
