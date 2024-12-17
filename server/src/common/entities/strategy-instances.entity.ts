import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Contribution } from './contribution.entity';

@Entity('strategy_instances')
export class StrategyInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  strategyKey: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  strategyType: string;

  @Column()
  startPrice: number;

  @Column('json')
  parameters: Record<string, any>;

  @Column()
  status: string; // "running", "stopped", etc.

  @OneToMany(() => Contribution, (contribution) => contribution.strategy)
  contributions: Contribution[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
