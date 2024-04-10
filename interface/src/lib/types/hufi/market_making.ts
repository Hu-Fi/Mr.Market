import type { SupportedPairs } from "$lib/types/hufi/exchanges";

export type MarketMakingStates = 'created' | 'paused' | 'deleted' | 'refunded';
export type MarketMakingDetailHistoryType = 'place_buy' | 'place_sell' | 'buy_filled' | 'sell_filled' | 'buy_canceled' | 'sell_canceled' | 'deposit' | 'withdraw' | 'stop' | 'resume' | 'delete'

export enum PriceSourceType {
  MID_PRICE = 'mid_price',
  BEST_ASK = 'best_ask',
  BEST_BID = 'best_bid',
  LAST_PRICE = 'last_price',
}

export interface MarketMakingOrder {
  orderId: string;
  userId: string;
  pair: string;
  exchangeName: string;
  bidSpread: string;
  askSpread: string;
  orderAmount: string;
  orderRefreshTime: string;
  numberOfLayers: string;
  priceSourceType: PriceSourceType;
  amountChangePerLayer: string;
  amountChangeType: 'fixed' | 'percentage';
  ceilingPrice?: string;
  floorPrice?: string;
  balanceA?: string;
  balanceB?: string;
  state: MarketMakingStates;
  createdAt: string;
}

export interface MarketMakingDetailHistory {
  type: MarketMakingDetailHistoryType;
  pair: SupportedPairs;
}