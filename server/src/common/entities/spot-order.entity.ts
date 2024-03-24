import { Entity, PrimaryColumn, Column } from 'typeorm';
import { SpotOrderType } from 'src/common/types/memo/memo';
import { PairsMapValue } from 'src/common/types/pairs/pairs';
import { SpotOrderStatus } from 'src/common/types/orders/states';

@Entity()
export class SpotOrder {
  @PrimaryColumn()
  orderId: string; // UUID

  @Column()
  snapshotId: string; // Mixin snapshot UUID

  @Column()
  userId: string;

  @Column()
  exchangeIndex: string; // Index of exchange

  @Column()
  type: SpotOrderType;

  @Column()
  state: SpotOrderStatus;

  @Column()
  symbol: PairsMapValue;

  @Column()
  baseAssetId: string; // Mixin asset UUID

  @Column()
  targetAssetId: string; // Mixin asset UUID

  @Column()
  apiKeyId: string; // API key id used for place order

  @Column()
  createdAt: string; // timestamp

  @Column()
  updatedAt: string; // timestamp
}
