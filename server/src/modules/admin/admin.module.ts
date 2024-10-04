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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketMakingHistory,
      ArbitrageHistory,
      Performance,
    ]),
    TradeModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    StrategyService,
    PerformanceService,
    TradeService,
    ExchangeInitService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
