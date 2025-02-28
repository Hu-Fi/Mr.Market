import {
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SIMPLY_GROW_MEMO_ACTION_MAP,
  SPOT_ACTION_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';

// Maintain /src/common/constants/memo.ts
export type TradingType = keyof typeof TARDING_TYPE_MAP;
export type SpotOrderType = keyof typeof SPOT_ORDER_TYPE_MAP;

export type ArbitrageMemoActionType = keyof typeof ARBITRAGE_MEMO_ACTION_MAP;
export type ArbitrageMemoActionValueType =
  (typeof ARBITRAGE_MEMO_ACTION_MAP)[keyof typeof ARBITRAGE_MEMO_ACTION_MAP];

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
export type SpotActionTypeValue =
  (typeof SPOT_ACTION_TYPE_MAP)[keyof typeof SPOT_ACTION_TYPE_MAP];

export interface SpotLimitMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  spotOrderType: SpotOrderTypeValue;
  action: SpotActionTypeValue;
  tradingPairId: string;
  limitPrice: string;
}

export interface SpotMarketMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  spotOrderType: SpotOrderTypeValue;
  action: SpotActionTypeValue;
  tradingPairId: string;
}

export interface ArbitrageCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: ArbitrageMemoActionType;
  arbitragePairId: string;
  orderId: string;
  rewardAddress: string;
}

export interface ArbitrageAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: ArbitrageMemoActionType;
  orderId: string;
}

export interface MarketMakingCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  marketMakingPairId: string;
  orderId: string;
  rewardAddress: string;
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
  rewardAddress: string;
}

export interface SimplyGrowAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: SimplyGrowMemoActionType;
  orderId: string;
}
