import {
  MARKET_MAKING_MEMO_ACTION_MAP,
  SIMPLY_GROW_MEMO_ACTION_MAP,
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';

// Maintain /src/common/constants/memo.ts
export type TradingType = keyof typeof TARDING_TYPE_MAP;
export type SpotOrderType = keyof typeof SPOT_ORDER_TYPE_MAP;
export type ExchangeIndex = keyof typeof SPOT_EXCHANGE_MAP;

export type MarketMakingMemoActionType =
  keyof typeof MARKET_MAKING_MEMO_ACTION_MAP;
export type MarketMakingMemoActionValueType =
  (typeof MARKET_MAKING_MEMO_ACTION_MAP)[keyof typeof MARKET_MAKING_MEMO_ACTION_MAP];

export type SimplyGrowMemoActionType = keyof typeof SIMPLY_GROW_MEMO_ACTION_MAP;
export type SimplyGrowMemoActionValueType =
  (typeof SIMPLY_GROW_MEMO_ACTION_MAP)[keyof typeof SIMPLY_GROW_MEMO_ACTION_MAP];

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
  destId: string;
  limitPrice?: string;
  refId?: string;
}

export interface MarketMakingCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  marketMakingPairId: string;
  orderId: string;
}

export interface MarketMakingAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  orderId: string;
}

export interface SimplyGrowCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: SimplyGrowMemoActionType;
  orderId: string;
}

export interface SimplyGrowAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: SimplyGrowMemoActionType;
  orderId: string;
}

export interface WithdrawalMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  destination: string;
  destinationTag?: string;
}

