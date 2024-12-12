import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class exchangeAPIKeysConfig {
  @PrimaryGeneratedColumn()
  key_id: string; // The unique sequence number of API key

  @Column()
  exchange: string; // The ccxt identifier of exchange

  @Column()
  name: string; // The name(alias) of API key

  @Column()
  api_key: string; // The API Key

  @Column()
  api_secret: string; // The secret

  @Column({ nullable: true })
  api_extra: string; // The extra information
}
