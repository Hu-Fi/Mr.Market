import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CustomConfigEntity {
  @PrimaryGeneratedColumn()
  config_id: number; // The index config, 0 by default

  @Column()
  max_balance_mixin_bot: string; // Max amount of money to keep in mixin bot

  @Column()
  max_balance_single_api_key: string; // Max amount of money to keep in single exchange API Key

  @Column()
  funding_account: string; // The address or info about a safe place for storing profit

  @Column()
  spot_fee: string; // The spot trading fee
}
