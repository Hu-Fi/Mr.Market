import type { SupportedPairs } from "$lib/types/hufi/exchanges";

export type MarketMakingDetailHistoryType = 'buy' | 'sell' | 'deposit' | 'withdraw' | 'stop' | 'resume' | 'delete'

export interface MarketMakingDetailHistory {
  type: MarketMakingDetailHistoryType;
  pair: SupportedPairs;
}