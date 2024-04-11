// src/entities/arbitrage-order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ArbitrageOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  pair: string;

  @Column()
  buyExchange: string;

  @Column()
  sellExchange: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  buyPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellPrice: number;

  @Column()
  profit: number;

  @Column()
  executedAt: Date;

  @Column()
  status: string; // 'open', 'closed', 'canceled'

  @Column()
  strategy: string; // 'arbitrage', 'market-making', etc.
}
