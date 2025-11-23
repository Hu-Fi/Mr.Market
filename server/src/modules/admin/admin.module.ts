import { Module } from '@nestjs/common';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminController } from './admin.controller';
import { StrategyService } from '../market-making/strategy/strategy.service';
import { PerformanceService } from '../market-making/performance/performance.service';
import { TradeService } from '../market-making/trade/trade.service';
import { ExchangeInitService } from '../infrastructure/exchange-init/exchange-init.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { TradeModule } from '../market-making/trade/trade.module';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { Contribution } from 'src/common/entities/contribution.entity';
import { Web3Module } from '../web3/web3.module';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { AdminGrowService } from './growdata/adminGrow.service';
import { GrowdataModule } from '../data/grow-data/grow-data.module';
import { ExchangeInitModule } from '../infrastructure/exchange-init/exchange-init.module';
import { AdminSpotService } from './admin-spot-management/admin-spot-management.service';
import { SpotdataModule } from '../data/spot-data/spot-data.module';
import { AdminMarketMakingConfigModule } from './market-making-config/admin-market-making-config.module';

@Module({
  imports: [
    ExchangeInitModule,
    GrowdataModule,
    SpotdataModule,
    TypeOrmModule.forFeature([
      MarketMakingHistory,
      ArbitrageHistory,
      StrategyInstance,
      MixinUser,
      Contribution,
      Performance,
    ]),
    TradeModule,
    Web3Module,
    AdminMarketMakingConfigModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminStrategyService,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
    AdminGrowService,
    AdminSpotService,
  ],
  exports: [
    AdminStrategyService,
    AdminGrowService,
    AdminSpotService,
  ],
})
export class AdminModule { }
