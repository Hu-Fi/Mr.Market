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

  @Column()
  biography: string;

  @Column({
    nullable: true,
  })
  avatar_url: string;

  @Column()
  relationship: string;

  @Column()
  mute_until: string;

  @Column()
  created_at: string;

  @Column()
  is_verified: boolean;

  @Column()
  is_scam: boolean;
}