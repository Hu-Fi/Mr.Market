import {
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

// Maintain /src/common/constants/memo.ts
export type TradingType = keyof typeof TARDING_TYPE_MAP;
export type SpotOrderType = keyof typeof SPOT_ORDER_TYPE_MAP;
export type ExchangeIndex = keyof typeof SPOT_EXCHANGE_MAP;

export type ArbitrageMemoActionType = keyof typeof ARBITRAGE_MEMO_ACTION_MAP;
export type MarketMakingMemoActionType =
  keyof typeof MARKET_MAKING_MEMO_ACTION_MAP;

export interface SpotMemoDetails {
  tradingType: TradingType;
  spotOrderType: SpotOrderType;
  exchangeIndex: ExchangeIndex;
  destId: PairsMapKey;
  limitPrice?: string;
  refId?: string;
}

export interface ArbitrageMemoDetails {
  tradingType: TradingType;
  action: ArbitrageMemoActionType;
  exchange0Index: ExchangeIndex;
  exchange1Index: ExchangeIndex;
  symbol: PairsMapKey;
}

export interface MarketMakingMemoDetails {
  tradingType: TradingType;
  action: MarketMakingMemoActionType;
  exchangeIndex: ExchangeIndex;
  symbol: PairsMapKey;
}
