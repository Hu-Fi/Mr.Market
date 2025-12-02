import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('spotdata_trading_pairs')
export class SpotdataTradingPair {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  ccxt_id: string;

  @Column()
  symbol: string;

  @Column()
  exchange_id: string;

  @Column()
  amount_significant_figures: string;

  @Column()
  price_significant_figures: string;

  @Column()
  buy_decimal_digits: string;

  @Column()
  sell_decimal_digits: string;

  @Column()
  max_buy_amount: string;

  @Column()
  max_sell_amount: string;

  @Column()
  base_asset_id: string;

  @Column()
  quote_asset_id: string;

  @Column({ nullable: true })
  custom_fee_rate: string;

  @Column()
  enable: boolean;
}
