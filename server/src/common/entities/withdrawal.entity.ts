import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 20, scale: 8 })
  amount: number;

  @Column()
  assetId: string;

  @Column()
  symbol: string;

  // Mixin snapshot tracking
  @Column({ nullable: true })
  @Index()
  snapshotId: string;

  @Column({ nullable: true })
  opponentId: string;

  // Memo information
  @Column({ nullable: true, type: 'text' })
  memo: string;

  @Column({ nullable: true })
  memoVersion: number;

  @Column({ nullable: true })
  tradingType: string;

  // Destination details
  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  destinationTag: string;

  // Transaction tracking
  @Column({ nullable: true })
  @Index()
  mixinTxId: string;

  @Column({ nullable: true })
  exchangeTxId: string;

  @Column({ nullable: true })
  onChainTxId: string;

  // Status tracking: 'pending', 'queued', 'processing', 'sent', 'confirmed', 'completed', 'failed', 'refunded'
  @Column({ default: 'pending' })
  @Index()
  status: string;

  // Type: 'deposit_to_exchange', 'withdraw_external', 'withdraw_to_address'
  @Column()
  type: string;

  // Error tracking
  @Column({ nullable: true, type: 'text' })
  errorMessage: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  lastCheckedAt: Date;

  // Withdrawal fee
  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  feeAmount: number;

  @Column({ nullable: true })
  feeAssetId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
