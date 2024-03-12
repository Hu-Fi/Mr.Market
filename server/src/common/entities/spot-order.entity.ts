import { Entity, PrimaryColumn, Column } from 'typeorm';
import { SpotOrderType } from 'src/common/types/memo/memo';
import { SpotOrderStatus } from 'src/common/types/orders/orders';
import { PairsMapValue } from 'src/common/types/pairs/pairs';

@Entity()
export class SpotOrder {
  @PrimaryColumn()
  order_id: string; // UUID

  @Column()
  snapshot_id: string; // Mixin snapshot UUID

  @Column()
  exchange_index: string; // Index of exchange

  @Column()
  type: SpotOrderType;

  @Column()
  state: SpotOrderStatus;

  @Column()
  symbol: PairsMapValue;

  @Column()
  base_asset_id: string; // Mixin asset UUID

  @Column()
  target_asset_id: string; // Mixin asset UUID

  @Column()
  created_at: string; // timestamp

  @Column()
  updated_at: string; // timestamp
}
