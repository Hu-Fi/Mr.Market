// src/entities/arbitrage-order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ArbitrageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  pair: string;

  @Column({ nullable: true })
  exchangeAName: string;

  @Column({ nullable: true })
  exchangeBName: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  buyPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sellPrice: number;

  @Column({ nullable: true })
  profit: number;

  @Column({ nullable: true })
  executedAt: Date;

  @Column({ nullable: true })
  status: string; // 'open', 'closed', 'canceled'

  @Column({ nullable: true })
  strategy: string; // 'arbitrage', 'market-making', etc.
}
