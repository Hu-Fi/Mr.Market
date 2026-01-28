import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import {
  ArbitrageStates,
  MarketMakingStates,
  SimplyGrowStates,
} from '../types/orders/states';

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

  @Column({ nullable: true })
  rewardAddress: string;
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

  @Column({ nullable: true })
  rewardAddress: string;
}

@Entity()
export class SimplyGrowOrder {
  @PrimaryColumn()
  orderId: string;

  @Column()
  userId: string;

  @Column()
  mixinAssetId: string;

  @Column()
  amount: string;

  @Column()
  state: SimplyGrowStates;

  @Column()
  createdAt: string;

  @Column()
  rewardAddress: string;
}

@Entity()
export class PaymentState {
  @PrimaryColumn()
  orderId: string; // the uuid of order

  @Column()
  userId: string; // snapshot opponent id

  @Column()
  type: string; // arbitrage or market_making

  @Column()
  symbol: string; // the symbol of trading pair

  // Market Making Assets (base + quote)
  @Column()
  baseAssetId: string; // base asset ID for market making

  @Column({ default: '0' })
  baseAssetAmount: string; // amount of base asset received

  @Column({ nullable: true })
  baseAssetSnapshotId: string; // snapshot ID for base asset transfer

  @Column()
  quoteAssetId: string; // quote asset ID for market making

  @Column({ default: '0' })
  quoteAssetAmount: string; // amount of quote asset received

  @Column({ nullable: true })
  quoteAssetSnapshotId: string; // snapshot ID for quote asset transfer

  // Withdrawal Fee Assets (may be same as base/quote or chain assets)
  @Column({ nullable: true })
  baseFeeAssetId: string; // asset ID for base withdrawal fee

  @Column({ default: '0' })
  baseFeeAssetAmount: string; // amount of base fee asset received

  @Column({ nullable: true })
  baseFeeAssetSnapshotId: string; // snapshot ID for base fee transfer

  @Column({ nullable: true })
  quoteFeeAssetId: string; // asset ID for quote withdrawal fee

  @Column({ default: '0' })
  quoteFeeAssetAmount: string; // amount of quote fee asset received

  @Column({ nullable: true })
  quoteFeeAssetSnapshotId: string; // snapshot ID for quote fee transfer

  // Required fees (calculated from FeeService)
  @Column({ nullable: true })
  requiredBaseWithdrawalFee: string; // required amount for base withdrawal

  @Column({ nullable: true })
  requiredQuoteWithdrawalFee: string; // required amount for quote withdrawal

  @Column({ nullable: true })
  requiredMarketMakingFee: string; // required market making fee

  @Column({ nullable: true })
  state: string; // payment_pending, payment_incomplete, payment_complete, timeout

  @Column()
  createdAt: string; // timestamp

  @Column()
  updatedAt: string; // timestamp
}
