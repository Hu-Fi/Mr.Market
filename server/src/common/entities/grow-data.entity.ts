import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('growdata_exchanges')
export class GrowdataExchange {
  @PrimaryColumn('')
  exchange_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon_url: string;

  @Column({ default: true })
  enable: boolean;
}

@Entity('growdata_simply_grow_tokens')
export class GrowdataSimplyGrowToken {
  @PrimaryColumn('uuid')
  asset_id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  icon_url: string;

  @Column({ nullable: true })
  apy: string;

  @Column({ default: true })
  enable: boolean;
}

@Entity('growdata_arbitrage_pairs')
export class GrowdataArbitragePair {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column()
  base_symbol: string;

  @Column()
  quote_symbol: string;

  @Column()
  base_asset_id: string;

  @Column()
  base_icon_url: string;

  @Column()
  quote_asset_id: string;

  @Column()
  quote_icon_url: string;

  @Column({ nullable: true })
  base_price: string;

  @Column({ nullable: true })
  target_price: string;

  @Column()
  base_exchange_id: string;

  @Column()
  target_exchange_id: string;

  @Column({ default: true })
  enable: boolean;
}

@Entity('growdata_market_making_pairs')
export class GrowdataMarketMakingPair {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column()
  base_symbol: string;

  @Column()
  quote_symbol: string;

  @Column()
  base_asset_id: string;

  @Column()
  base_icon_url: string;

  @Column()
  quote_asset_id: string;

  @Column()
  quote_icon_url: string;

  @Column({ nullable: true })
  base_price: string;

  @Column({ nullable: true })
  target_price: string;

  @Column()
  exchange_id: string;

  @Column({ nullable: true })
  custom_fee_rate: string;

  @Column({ default: true })
  enable: boolean;
}
