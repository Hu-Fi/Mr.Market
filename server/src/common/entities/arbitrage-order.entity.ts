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

  @Column({ type: 'text', nullable: true })
  amount: string; // Stored as string for SQLite, use BigNumber.js for calculations

  @Column({ type: 'text', nullable: true })
  buyPrice: string; // Stored as string for SQLite, use BigNumber.js for calculations

  @Column({ type: 'text', nullable: true })
  sellPrice: string; // Stored as string for SQLite, use BigNumber.js for calculations

  @Column({ nullable: true })
  profit: number;

  @Column({ nullable: true })
  executedAt: Date;

  @Column({ nullable: true })
  status: string; // 'open', 'closed', 'canceled'

  @Column({ nullable: true })
  strategy: string; // 'arbitrage', 'market-making', etc.
}
