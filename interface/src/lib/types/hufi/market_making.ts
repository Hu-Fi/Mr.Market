import type { SupportedPairs } from "$lib/types/hufi/exchanges";

export type MarketMakingDetailHistoryType = 'place_buy' | 'place_sell' | 'buy_filled' | 'sell_filled' | 'buy_canceled' | 'sell_canceled' | 'deposit' | 'withdraw' | 'stop' | 'resume' | 'delete'

export interface MarketMakingDetailHistory {
  type: MarketMakingDetailHistoryType;
  pair: SupportedPairs;
}