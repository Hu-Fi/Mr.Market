import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn()
  exchange_id: string;

  @Column()
  name: string;
}

@Entity('simply_grow_tokens')
export class SimplyGrowToken {
  @PrimaryGeneratedColumn()
  asset_id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  icon_url: string;

  @Column({ nullable: true })
  apy: string;
}

@Entity('arbitrage_pairs')
export class ArbitragePair {
  @PrimaryGeneratedColumn()
  symbol: string;

  @Column()
  base_symbol: string;

  @Column()
  target_symbol: string;

  @Column()
  base_asset_id: string;

  @Column()
  base_icon_url: string;

  @Column()
  target_asset_id: string;

  @Column()
  target_icon_url: string;

  @Column({ nullable: true })
  base_price: string;

  @Column({ nullable: true })
  target_price: string;

  @ManyToOne(() => Exchange)
  @JoinColumn({ name: 'exchange_id' })
  exchange: Exchange;
}

@Entity('market_making_pairs')
export class MarketMakingPair {
  @PrimaryGeneratedColumn()
  symbol: string;

  @Column()
  base_symbol: string;

  @Column()
  target_symbol: string;

  @Column()
  base_asset_id: string;

  @Column()
  base_icon_url: string;

  @Column()
  target_asset_id: string;

  @Column()
  target_icon_url: string;

  @Column({ nullable: true })
  base_price: string;

  @Column({ nullable: true })
  target_price: string;

  @ManyToOne(() => Exchange)
  @JoinColumn({ name: 'exchange_id' })
  exchange: Exchange;
}
