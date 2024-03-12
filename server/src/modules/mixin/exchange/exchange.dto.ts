import { ApiProperty } from '@nestjs/swagger';
import { ExchangeIndex, SpotOrderType } from 'src/common/types/memo/memo';
import { SpotOrderStatus } from 'src/common/types/orders/states';
import { PairsMapValue } from 'src/common/types/pairs/pairs';

export class ExchangePlaceSpotEventDto {
  @ApiProperty({ description: 'Order ID' })
  orderId: string;

  @ApiProperty({ description: 'Exchange index' })
  exchangeIndex: ExchangeIndex;

  @ApiProperty({ description: 'Snapshot ID' })
  snapshotId: string;

  @ApiProperty({ description: 'Type of spot order' })
  type: SpotOrderType;

  @ApiProperty({ description: 'Status of spot order' })
  state: SpotOrderStatus;

  @ApiProperty({ description: 'Trading symbol' })
  symbol: PairsMapValue;

  @ApiProperty({ description: 'Base asset ID' })
  baseAssetId: string;

  @ApiProperty({ description: 'Target asset ID' })
  targetAssetId: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: string;
}
