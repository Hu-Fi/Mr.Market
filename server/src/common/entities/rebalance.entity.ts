import { Column, Entity, PrimaryColumn } from 'typeorm';

export class TransferRecord {
  @PrimaryColumn()
  id: string;

  @Column()
  symbol: string;

  @Column()
  network: string;

  @Column()
  amount: string;

  @Column()
  amount_usd: string;

  @Column()
  source_key_id: string;

  @Column()
  destination_key_id: string;

  @Column()
  tx_hash: string;

  @Column({ nullable: true })
  memo: string;

  @Column({ nullable: true })
  gas_fee: string;

  @Column({ nullable: true })
  gas_fee_usd: string;

  @Column()
  created_at: string;
}

@Entity()
export class WithdrawalRecord {
  @PrimaryColumn()
  id: string;

  @Column()
  api_key_id: string;

  @Column()
  symbol: string;

  @Column()
  amount: string;

  @Column()
  network: string;

  @Column()
  tx_hash: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  memo: string;

  @Column({ nullable: true })
  gas_fee: string;

  @Column({ nullable: true })
  gas_fee_usd: string;

  @Column()
  created_at: string;
}
