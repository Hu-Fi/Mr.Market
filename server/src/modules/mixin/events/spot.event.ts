export class SpotOrderCreateEvent {
  tradingType: string;
  spotOrderType: string;
  exchange: string;
  destId: string;
  limitPrice?: string;
  refId: string;
}
