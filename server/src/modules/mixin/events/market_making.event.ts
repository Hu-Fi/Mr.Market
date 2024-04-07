import { PriceSourceType } from 'src/common/enum/pricesourcetype';

export class MarketMakingCreateEvent {
  clientId: string;
  userId: string;
  pair: string;
  exchangeName: string;
  bidSpread: number;
  askSpread: number;
  orderAmount: number;
  orderRefreshTime: number;
  numberOfLayers: number;
  priceSourceType: PriceSourceType;
  amountChangePerLayer: number;
  amountChangeType: 'fixed' | 'percentage';
  ceilingPrice?: number;
  floorPrice?: number;
}
