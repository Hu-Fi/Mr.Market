import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  //   ManyToOne,
  CreateDateColumn,
} from 'typeorm';
// import { StrategyInstance } from './strategy-instances.entity';
// import { MixinUser } from './mixin-user.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  //   @ManyToOne(() => StrategyInstance, (strategy) => strategy.contributions, { onDelete: 'CASCADE' })
  //   strategy: StrategyInstance;

  //   @ManyToOne(() => MixinUser, (mixinUser) => mixinUser.contributions, { onDelete: 'CASCADE' })
  //   mixinUser: MixinUser;

  @CreateDateColumn()
  joinedAt: Date;
}
