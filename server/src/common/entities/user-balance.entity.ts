import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  exchange: string; // Identifier for the exchange

  @Column()
  currency: string;

  @Column({ type: 'text', default: '0' })
  balance: string; // Stored as string for SQLite, use BigNumber.js for calculations
}
