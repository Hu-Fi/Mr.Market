import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class RebalanceExchange {
  @PrimaryGeneratedColumn('uuid')
  mixin_asset_id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => CurrencyMinAmount,
    (currencyMinAmount) => currencyMinAmount.exchange,
  )
  currencyMinAmounts: CurrencyMinAmount[];
}

@Entity()
export class CurrencyMinAmount {
  @PrimaryGeneratedColumn('uuid')
  mixin_asset_id: string;

  @Column()
  exchangeId: string;

  @ManyToOne(() => RebalanceExchange, (exchange) => exchange.currencyMinAmounts)
  @JoinColumn({ name: 'exchangeId' })
  exchange: RebalanceExchange;

  @Column()
  symbol: string;

  @Column()
  minium_balance: string;
}
