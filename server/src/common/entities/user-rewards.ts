import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserExchangeReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  exchange: string;

  @Column('double precision')
  score: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  pair: string;
}
