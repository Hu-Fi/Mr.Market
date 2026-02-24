import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Side } from '../constants/side';

@Entity({ name: 'indicator_strategy_history' })
export class IndicatorStrategyHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  clientId!: string;

  @Column()
  exchange!: string;

  @Column()
  symbol!: string;

  @Column({ type: 'float' })
  price!: number;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'varchar' })
  side!: Side;

  @Column({ type: 'varchar', default: 'timeIndicator' })
  strategy!: string;

  @Column({ nullable: true })
  orderId?: string;

  @CreateDateColumn()
  executedAt!: Date;
}
