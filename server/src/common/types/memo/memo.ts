export type TradingType = 'SP' | 'SW' | 'MM' | 'AR' | 'LE' | 'PE';
export type SpotOrderType = 'LB' | 'LS' | 'MB' | 'MS';
export type ExchangeIndex = '01' | '02' | '03' | '04';
// spotExchangeMap in /src/common/constants/memo.ts

export interface MemoDetails {
  tradingType: string;
  spotOrderType: string;
  exchange: string;
  destId: string;
  limitPrice?: string;
  refId: string;
}
