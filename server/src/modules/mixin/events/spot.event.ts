import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { SpotOrderStatus } from 'src/common/types/orders/states';
import { SpotOrderType, TradingTypeValue } from 'src/common/types/memo/memo';

export class SpotOrderCreateEvent {
  tradingType: TradingTypeValue;
  spotOrderType: string;
  exchangeName: string;
  action: string;
  tradingPairId: string;
  limitPrice?: string;
  snapshot: SafeSnapshot;
}

export class ExchangePlaceSpotEvent {
  orderId: string;
  exchangeName: string;
  snapshotId: string;
  userId: string;
  type: SpotOrderType;
  state: SpotOrderStatus;
  symbol: string;
  baseAssetId: string;
  targetAssetId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  limitPrice?: string;
}

export class MixinReleaseTokenEvent {
  orderId: string;
  userId: string;
  assetId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}
