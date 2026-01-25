import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MarketMakingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  exchange: string;

  @Column()
  pair: string;

  @Column()
  side: string; // 'buy' or 'sell'

  @Column({ type: 'text', nullable: true })
  amount: string; // Stored as string for SQLite, use BigNumber.js for calculations

  @Column({ type: 'text', nullable: true })
  price: string; // Stored as string for SQLite, use BigNumber.js for calculations

  @Column()
  orderId: string; // The order ID from the exchange

  @Column({ nullable: true })
  executedAt: Date;

  @Column({ nullable: true })
  status: string; // 'open', 'closed', 'canceled'

  @Column({ nullable: true })
  strategy: string; // 'arbitrage', 'market-making', etc.

  @Column({ nullable: true })
  strategyInstanceId: string;
}
