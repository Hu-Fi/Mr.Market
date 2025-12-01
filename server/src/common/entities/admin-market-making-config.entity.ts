import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admin_market_making_config')
export class AdminMarketMakingConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exchange: string;

  @Column()
  symbol: string;

  @Column()
  baseSymbol: string;

  @Column()
  quoteSymbol: string;

  @Column()
  baseAssetId: string;

  @Column()
  quoteAssetId: string;

  @Column({ nullable: true })
  baseIcon: string;

  @Column({ nullable: true })
  quoteIcon: string;

  @Column({ default: true })
  isEnabled: boolean;
}
