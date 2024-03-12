import { Entity, PrimaryColumn, Column } from 'typeorm';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

@Entity()
export class MixinReleaseToken {
  @PrimaryColumn()
  orderId: string; // UUID

  @Column()
  userId: string; // User UUID

  @Column()
  assetId: string; // Asset UUID

  @Column()
  state: string; // state of release token

  @Column()
  amount: string; // amount of token

  @Column()
  createdAt: string; // timestamp

  @Column()
  updatedAt: string; // timestamp
}

@Entity()
export class MixinReleaseHistory {
  @PrimaryColumn()
  orderId: string; // UUID

  @Column()
  snapshot: SafeSnapshot; // Mixin snapshot

  @Column()
  createdAt: string; // timestamp
}
