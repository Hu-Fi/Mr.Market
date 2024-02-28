import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // Identifier for the sub-user

  @Column()
  clientId: string; // Identifier for the client

  @Column()
  symbol: string; // E.g., 'BTC/USD'

  @Column()
  side: string; // 'buy' or 'sell'

  @Column()
  type: string; // 'market' or 'limit'

  @Column('decimal', { precision: 18, scale: 10 })
  amount: number; // Quantity of the asset

  @Column('decimal', { precision: 18, scale: 10 })
  price: number; // Price at which the trade was executed

  @Column({ default: 'pending' })
  status: string; // Status of the transaction ('pending', 'completed', 'cancelled', etc.)

  @Column()
  orderId: string; // Unique identifier for the order

  @CreateDateColumn()
  createdAt: Date; // When the transaction was created

  @UpdateDateColumn()
  updatedAt: Date; // When the transaction was last updated
}
