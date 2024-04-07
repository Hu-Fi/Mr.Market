export class ArbitrageCreateEvent {
  orderId: string;
  userId: string;
  pair: string;
  amountToTrade: number;
  minProfitability: number;
  exchangeAName: string;
  exchangeBName: string;
}
