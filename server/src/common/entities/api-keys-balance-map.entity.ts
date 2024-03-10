// balance-map.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class APIKeysBalanceMapConfig {
  @PrimaryColumn()
  key_id: string; // The UUID used for identity API key

  @Column()
  exchange: string; // The identifier of the exchange

  @Column()
  currency: string; // The currency symbol (e.g., BTC, ETH, USDT)

  @Column()
  balance_usd: string; // The balance in usd

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number; // The balance of the currency in the exchange

  @Column({ type: 'datetime' })
  updatedAt: Date; // The timestamp when the balance was last updated
}
