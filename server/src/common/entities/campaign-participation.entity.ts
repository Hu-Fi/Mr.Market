import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CampaignParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  orderId: string; // Link to specific market making order if applicable

  @Column('decimal', { precision: 20, scale: 8, default: 0 })
  contributionAmount: number;

  @Column('decimal', { precision: 20, scale: 8, nullable: true })
  rewardAmount: number;

  @Column()
  status: string; // 'joined', 'rewarded'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
