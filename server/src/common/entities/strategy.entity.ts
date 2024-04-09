import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { ArbitrageStates, MarketMakingStates } from '../types/orders/states';

@Entity()
export class ArbitrageOrder {
  @PrimaryColumn()
  orderId: string;

  @Column()
  userId: string;

  @Column()
  pair: string;

  @Column()
  amountToTrade: string;

  @Column()
  minProfitability: string;

  @Column()
  exchangeAName: string;

  @Column()
  exchangeBName: string;

  @Column({ nullable: true })
  balanceA?: string;

  @Column({ nullable: true })
  balanceB?: string;

  @Column()
  state: ArbitrageStates;

  @Column()
  createdAt: string;
}

@Entity()
export class MarketMakingOrder {
  @PrimaryColumn()
  orderId: string;

  @Column()
  userId: string;

  @Column()
  pair: string;

  @Column()
  exchangeName: string;

  @Column()
  bidSpread: string;

  @Column()
  askSpread: string;

  @Column()
  orderAmount: string;

  @Column()
  orderRefreshTime: string;

  @Column()
  numberOfLayers: string;

  @Column()
  priceSourceType: PriceSourceType;

  @Column()
  amountChangePerLayer: string; // This can be a fixed amount or a percentage

  @Column()
  amountChangeType: 'fixed' | 'percentage';

  @Column()
  ceilingPrice?: string;

  @Column()
  floorPrice?: string;

  @Column({ nullable: true })
  balanceA?: string;

  @Column({ nullable: true })
  balanceB?: string;

  @Column()
  state: MarketMakingStates;

  @Column()
  createdAt: string;
}

@Entity()
export class PaymentState {
  @PrimaryColumn()
  orderId: string; // the uuid of order

  @Column()
  type: string; // arbitrage or market_making

  @Column()
  symbol: string; // the symbol of trading pair

  @Column()
  firstAssetId: string; // the mixin uuid of the first asset

  @Column()
  firstAssetAmount: string; // the amount of the first asset

  @Column({ nullable: true })
  secondAssetId: string; // the mixin uuid of the second asset

  @Column({ nullable: true })
  secondAssetAmount: string; // the amount of the second asset

  @Column()
  firstSnapshotId: string; // the mixin snapshot id of first transfer

  @Column({ nullable: true })
  secondSnapshotId: string; // the mixin snapshot id of second transfer

  @Column({ nullable: true })
  state: string; // created or timeout

  @Column()
  createdAt: string; // timestamp

  @Column()
  updatedAt: string; // timestamp
}
