import type { SupportedExchanges } from "$lib/types/hufi/exchanges";

export type ArbitrageStates = 'created' | 'paused' | 'deleted' | 'refunded';
export type ArbitrageDetailHistoryType = 'buy' | 'sell' | 'deposit' | 'withdraw' | 'stop' | 'resume' | 'delete'

export interface ArbitrageOrder {
  orderId: string;
  userId: string;
  pair: string;
  amountToTrade: string;
  minProfitability: string;
  exchangeAName: string;
  exchangeBName: string;
  balanceA?: string;
  balanceB?: string;
  state: ArbitrageStates;
  createdAt: string;
}


export interface ArbitrageDetailHistory {
  type: ArbitrageDetailHistoryType;
  exchange: SupportedExchanges
}