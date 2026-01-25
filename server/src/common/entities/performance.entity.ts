import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  strategyType: string; // e.g., "arbitrage", "momentum"

  @Column('float')
  profitLoss: number;

  @Column('simple-json', { nullable: true })
  additionalMetrics: { [key: string]: any }; // Store additional, strategy-specific metrics

  @CreateDateColumn()
  executedAt: Date;
}
