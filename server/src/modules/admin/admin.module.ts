import { Module } from '@nestjs/common';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminController } from './admin.controller';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import { TradeService } from '../trade/trade.service';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { TradeModule } from '../trade/trade.module';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { Contribution } from 'src/common/entities/contribution.entity';
import { Web3Module } from '../web3/web3.module';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { AdminGrowService } from './growdata/adminGrow.service';
import { GrowdataModule } from '../growdata/growdata.module';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';
import { AdminSpotService } from './spotData/adminSpot.service';
import { SpotdataModule } from '../spotdata/spotdata.module';
import { AdminMarketMakingConfigService } from './market-making-config/admin-market-making-config.service';
import { AdminMarketMakingConfigController } from './market-making-config/admin-market-making-config.controller';
import { AdminMarketMakingConfig } from 'src/common/entities/admin-market-making-config.entity';

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
      AdminMarketMakingConfig,
    ]),
    TradeModule,
    Web3Module,
  ],
  controllers: [AdminController, AdminMarketMakingConfigController],
  providers: [
    AdminStrategyService,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
    AdminGrowService,
    AdminSpotService,
    AdminMarketMakingConfigService,
  ],
  exports: [
    AdminStrategyService,
    AdminGrowService,
    AdminSpotService,
    AdminMarketMakingConfigService,
  ],
})
export class AdminModule { }
