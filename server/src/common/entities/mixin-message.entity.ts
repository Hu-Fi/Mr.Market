import { MessageCategory, MessageStatus } from '@mixin.dev/mixin-node-sdk';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MixinMessage {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column()
  type: string;

  @Column()
  representative_id: string;

  @Column()
  quote_message_id: string;

  @Column()
  conversation_id: string;

  @Column()
  user_id: string;

  @Column()
  session_id: string;

  @Column()
  category: MessageCategory;

  @Column()
  data: string;

  @Column()
  data_base64: string;

  @Column()
  status: MessageStatus;

  @Column()
  source: string;

  @Column({ type: 'text' })
  created_at: string;

  @Column({ type: 'text' })
  updated_at: string;
}
