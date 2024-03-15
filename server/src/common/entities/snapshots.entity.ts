import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Snapshot {
  @PrimaryColumn()
  snapshot_id: string;

  @Column()
  type: string;

  @Column()
  asset_id: string;

  @Column()
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

  @Column()
  trace_id: string;

  @Column()
  confirmations: number;

  @Column()
  opening_balance: string;

  @Column()
  closing_balance: string;
}
