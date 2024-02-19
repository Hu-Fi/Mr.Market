import type { SupportedExchanges } from "$lib/types/hufi/exchanges";

export interface StrategyDto {
  userId: string;
  clientId: string;
  pair: string;
  amountToTrade: number;
  minProfitability: number;
  exchangeAName: string;
  exchangeBName: string;
}

export type ArbitrageDetailHistoryType = 'buy' | 'sell' | 'deposit' | 'withdraw' | 'stop' | 'resume' | 'delete'

export interface ArbitrageDetailHistory {
  type: ArbitrageDetailHistoryType;
  exchange: SupportedExchanges
}