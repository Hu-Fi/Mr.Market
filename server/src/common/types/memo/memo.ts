import {
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import { PairsMapKey, PairsMapValue } from 'src/common/types/pairs/pairs';

// Maintain /src/common/constants/memo.ts
export type TradingType = keyof typeof TARDING_TYPE_MAP;
export type SpotOrderType = keyof typeof SPOT_ORDER_TYPE_MAP;
export type ExchangeIndex = keyof typeof SPOT_EXCHANGE_MAP;

export type ArbitrageMemoActionType = keyof typeof ARBITRAGE_MEMO_ACTION_MAP;
export type ArbitrageMemoActionValueType =
  (typeof ARBITRAGE_MEMO_ACTION_MAP)[keyof typeof ARBITRAGE_MEMO_ACTION_MAP];

export type MarketMakingMemoActionType =
  keyof typeof MARKET_MAKING_MEMO_ACTION_MAP;
export type MarketMakingMemoActionValueType =
  (typeof MARKET_MAKING_MEMO_ACTION_MAP)[keyof typeof MARKET_MAKING_MEMO_ACTION_MAP];

export type TradingTypeValue =
  (typeof TARDING_TYPE_MAP)[keyof typeof TARDING_TYPE_MAP];
export type SpotOrderTypeValue =
  (typeof SPOT_ORDER_TYPE_MAP)[keyof typeof SPOT_ORDER_TYPE_MAP];
export type ExchangeIndexValue =
  (typeof SPOT_EXCHANGE_MAP)[keyof typeof SPOT_EXCHANGE_MAP];

export interface SpotMemoDetails {
  tradingType: TradingTypeValue;
  spotOrderType: SpotOrderTypeValue;
  exchangeName: ExchangeIndexValue;
  destId: PairsMapKey;
  limitPrice?: string;
  refId?: string;
}

export interface ArbitrageMemoDetails {
  tradingType: TradingTypeValue;
  action: ArbitrageMemoActionType;
  exchangeAName: ExchangeIndexValue;
  exchangeBName: ExchangeIndexValue;
  symbol: PairsMapValue;
  traceId: string;
}

export interface MarketMakingMemoDetails {
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  exchangeName: ExchangeIndexValue;
  symbol: PairsMapValue;
  traceId: string;
}
