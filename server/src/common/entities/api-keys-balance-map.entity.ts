import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class APIKeysBalanceMapConfig {
  @PrimaryGeneratedColumn()
  key_id: string; // The UUID used for identity API key

  @Column()
  balance_usd: string; // The balance in usd

  @Column()
  balance_tbd: string; // The balance map of the key TBD
}
