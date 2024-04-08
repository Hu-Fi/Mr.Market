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
  amountToTrade: number;

  @Column()
  minProfitability: number;

  @Column()
  exchangeAName: string;

  @Column()
  exchangeBName: string;

  @Column()
  state: ArbitrageStates;
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
  bidSpread: number;

  @Column()
  askSpread: number;

  @Column()
  orderAmount: number;

  @Column()
  orderRefreshTime: number;

  @Column()
  numberOfLayers: number;

  @Column()
  priceSourceType: PriceSourceType;

  @Column()
  amountChangePerLayer: number; // This can be a fixed amount or a percentage

  @Column()
  amountChangeType: 'fixed' | 'percentage';

  @Column()
  ceilingPrice?: number;

  @Column()
  floorPrice?: number;

  @Column()
  state: MarketMakingStates;
}
