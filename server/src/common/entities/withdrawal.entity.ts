import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ nullable: true })
  mixinTxId: string;

  @Column({ nullable: true })
  exchangeTxId: string;

  @Column({ nullable: true })
  onChainTxId: string;

  @Column()
  status: string; // 'pending', 'processing', 'completed', 'failed'

  @Column()
  type: string; // 'deposit_to_exchange', 'withdraw_external'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
