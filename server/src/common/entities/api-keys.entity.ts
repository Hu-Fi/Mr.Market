import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class APIKeysConfig {
  @PrimaryGeneratedColumn()
  key_id: string; // The UUID used for identity API key

  @Column()
  exchange: string; // The identifier of exchange

  @Column()
  exchange_index: string; // The index used in the exchange map

  @Column()
  name: string; // The name(alias) of API key

  @Column()
  api_key: string; // The API Key

  @Column()
  api_secret: string; // The secret
}
