import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CustomConfigEntity {
  @PrimaryColumn({ default: 1 })
  id: number; // Singleton ID

  // Unused
  @Column({ nullable: true })
  max_balance_mixin_bot: string; // Max amount of money to keep in mixin bot

  // Unused
  @Column({ nullable: true })
  max_balance_single_api_key: string; // Max amount of money to keep in single exchange API Key

  // Unused
  @Column({ nullable: true })
  funding_account: string; // The address or info about a safe place for storing profit

  @Column()
  spot_fee: string; // The spot trading fee
}
