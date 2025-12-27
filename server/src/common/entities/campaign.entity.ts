import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  pair: string;

  @Column()
  exchange: string;

  @Column()
  rewardToken: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: string; // 'active', 'completed', 'cancelled'

  @Column('decimal', { precision: 20, scale: 8 })
  totalReward: number;

  @Column({ nullable: true })
  type: string; // 'volume', 'liquidity', etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
