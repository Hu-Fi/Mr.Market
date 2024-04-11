import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  exchange: string;

  @Column()
  pair: string;

  @Column()
  side: string; // 'buy' or 'sell'

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  orderId: string; // The order ID from the exchange

  @Column({ nullable: true })
  executedAt: Date;

  @Column({ nullable: true })
  status: string; // 'open', 'closed', 'canceled'

  @Column()
  strategy: string; // 'arbitrage', 'market-making', etc.
}
