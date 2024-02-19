import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; 

  @Column()
  exchange: string; 

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  type: 'deposit' | 'withdrawal';

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';
}