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

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column()
  orderId: string; // The order ID from the exchange

  @Column({ nullable: true })
  executedAt: Date;

  @Column({ nullable: true })
  status: string; // 'open', 'closed', 'canceled'

  @Column({ nullable: true })
  strategy: string; // 'arbitrage', 'market-making', etc.
}
