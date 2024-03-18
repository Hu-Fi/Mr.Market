import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MixinUser {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  type: string;

  @Column()
  identity_number: string;

  @Column()
  phone: string;

  @Column()
  full_name: string;

  @Column({
    nullable: true,
  })
  avatar_url: string;

  @Column()
  created_at: string;

  @Column()
  last_updated: string;
}