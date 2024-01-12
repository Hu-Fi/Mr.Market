export interface StrategyDto {
  userId: string;
  clientId: string;
  pair: string;
  amountToTrade: number;
  minProfitability: number;
  exchangeAName: string;
  exchangeBName: string;
}