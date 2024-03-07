import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Snapshot {
  @PrimaryColumn()
  snapshot_id: string;

  @Column()
  type: string;

  @Column()
  asset_id: string;

  @Column('decimal', { precision: 8, scale: 18 })
  amount: string;

  @Column()
  user_id: string;

  @Column()
  opponent_id: string;

  @Column()
  memo: string;

  @Column()
  transaction_hash: string;

  @Column()
  created_at: string;

  @Column({ nullable: true })
  trace_id: string;

  @Column({ type: 'int', nullable: true })
  confirmations: number;

  @Column('decimal', { precision: 8, scale: 18, nullable: true })
  opening_balance: string;

  @Column('decimal', { precision: 8, scale: 18, nullable: true })
  closing_balance: string;
}
