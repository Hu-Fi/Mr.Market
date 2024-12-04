import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import { TradeService } from '../trade/trade.service';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { TradeModule } from '../trade/trade.module';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { Contribution } from 'src/common/entities/contribution.entity';
import { Web3Module } from '../web3/web3.module';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { SnapshotsService } from '../mixin/snapshots/snapshots.service';

@Module({
  imports: [
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
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
    SnapshotsService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
