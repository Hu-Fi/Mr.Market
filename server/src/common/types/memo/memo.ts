import {
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SIMPLY_GROW_MEMO_ACTION_MAP,
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
  rewardAddress: string;
}

export interface MarketMakingMemoDetails {
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  exchangeName: ExchangeIndexValue;
  symbol: PairsMapValue;
  traceId: string;
  rewardAddress: string;
}

// New

export interface ArbitrageCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: ArbitrageMemoActionType;
  arbitragePairId: string;
  traceId: string;
  rewardAddress: string;
}

export interface ArbitrageAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: ArbitrageMemoActionType;
  orderId: string;
  traceId: string;
}

export interface MarketMakingCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  marketMakingPairId: string;
  traceId: string;
}

export interface MarketMakingAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: MarketMakingMemoActionType;
  orderId: string;
  traceId: string;
}

export interface SimplyGrowCreateMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: SimplyGrowMemoActionType;
  traceId: string;
}

export interface SimplyGrowAddMemoDetails {
  version: number;
  tradingType: TradingTypeValue;
  action: SimplyGrowMemoActionType;
  orderId: string;
  traceId: string;
}
