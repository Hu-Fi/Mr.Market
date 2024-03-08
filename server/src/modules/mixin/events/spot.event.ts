import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import {
  ExchangeIndex,
  SpotOrderType,
  TradingType,
} from 'src/common/types/memo/memo';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

export class SpotOrderCreateEvent {
  tradingType: TradingType;
  spotOrderType: SpotOrderType;
  exchange: ExchangeIndex;
  destId: PairsMapKey;
  limitPrice?: string;
  refId: string;
  snapshot: SafeSnapshot;
}
