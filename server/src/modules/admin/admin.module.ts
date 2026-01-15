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
import { AdminFeeController } from './fee/admin-fee.controller';
import { AdminFeeService } from './fee/admin-fee.service';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';
import { GrowdataMarketMakingPair } from 'src/common/entities/grow-data.entity';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { AdminExchangesModule } from './exchanges/exchanges.module';

@Module({
  imports: [
    AdminExchangesModule,
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
      CustomConfigEntity,
      GrowdataMarketMakingPair,
      SpotdataTradingPair,
    ]),
    TradeModule,
    Web3Module,
  ],
  controllers: [AdminController, AdminFeeController],
  providers: [
    AdminStrategyService,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
    AdminGrowService,
    AdminSpotService,
    AdminFeeService,
  ],
  exports: [
    AdminStrategyService,
    AdminGrowService,
    AdminSpotService,
    AdminFeeService,
  ],
})
export class AdminModule {}
