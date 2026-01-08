import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UserOrdersController } from './user-orders.controller';
import { UserOrdersService } from './user-orders.service';
import { MarketMakingOrderProcessor } from './market-making.processor';
import { StrategyModule } from '../strategy/strategy.module';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from 'src/common/entities/user-orders.entity';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { FeeModule } from '../fee/fee.module';
import { GrowdataModule } from 'src/modules/data/grow-data/grow-data.module';
import { SnapshotsModule } from 'src/modules/mixin/snapshots/snapshots.module';
import { WithdrawalModule } from 'src/modules/mixin/withdrawal/withdrawal.module';
import { LocalCampaignModule } from '../local-campaign/local-campaign.module';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { NetworkMappingModule } from '../network-mapping/network-mapping.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from 'src/modules/campaign/campaign.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ArbitrageOrder,
      MarketMakingOrder,
      PaymentState,
      SimplyGrowOrder,
      MarketMakingHistory,
      ArbitrageHistory,
    ]),
    forwardRef(() => StrategyModule),
    FeeModule,
    GrowdataModule,
    SnapshotsModule,
    WithdrawalModule,
    LocalCampaignModule,
    ExchangeModule,
    NetworkMappingModule,
    CampaignModule,
  ],
  controllers: [UserOrdersController],
  providers: [UserOrdersService, MarketMakingOrderProcessor],
  exports: [UserOrdersService],
})
export class UserOrdersModule { }
