import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import {
  ExchangeIndexValue,
  SpotOrderType,
  SpotOrderTypeValue,
  TradingTypeValue,
} from 'src/common/types/memo/memo';
import { SpotOrderStatus } from 'src/common/types/orders/states';

export class SpotOrderCreateEvent {
  tradingType: TradingTypeValue;
  spotOrderType: SpotOrderTypeValue;
  exchangeName: ExchangeIndexValue;
  destId: string;
  limitPrice?: string;
  refId?: string;
  snapshot: SafeSnapshot;
}

export class ExchangePlaceSpotEvent {
  orderId: string;
  exchangeName: ExchangeIndexValue;
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
  refId?: string;
}

export class MixinReleaseTokenEvent {
  orderId: string;
  userId: string;
  assetId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}
