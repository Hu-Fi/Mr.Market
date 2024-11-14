import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { StrategyInstance } from './strategy-instances.entity';
import { MixinUser } from './mixin-user.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column()
  status: string; // "pending", "confirmed", etc.

  @Column()
  transactionHash: string;

  @Column()
  tokenSymbol: string; // New field for token symbol

  @Column()
  chainId: number; // New field for chain ID

  @Column()
  tokenAddress: string; // New field for token contract address

  @ManyToOne(() => StrategyInstance, (strategy) => strategy.contributions, {
    onDelete: 'CASCADE',
  })
  strategy: StrategyInstance;

  @ManyToOne(() => MixinUser, (mixinUser) => mixinUser.contributions, {
    onDelete: 'CASCADE',
  })
  mixinUser: MixinUser;

  @CreateDateColumn()
  joinedAt: Date;
}
