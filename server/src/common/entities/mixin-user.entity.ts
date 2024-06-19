import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MixinUser {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    nullable: true,
  })
  type: string;

  @Column()
  identity_number: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column()
  full_name: string;

  @Column({
    nullable: true,
  })
  avatar_url: string;

  @Column()
  jwt_token: string;

  @Column()
  created_at: string;

  @Column()
  last_updated: string;
}
