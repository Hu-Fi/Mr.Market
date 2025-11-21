import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { TradeModule } from '../trade/trade.module';
import { PerformanceModule } from '../performance/performance.module';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from 'src/common/entities/strategy-user.entity';
import { ConfigModule } from '@nestjs/config';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { AlpacaStratService } from './alpacastrat.service';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TradeModule,
    PerformanceModule,
    LoggerModule,
    ExchangeInitModule,
    ConfigModule,
    AdminModule,
    TypeOrmModule.forFeature([
      ArbitrageOrder,
      SimplyGrowOrder,
      MarketMakingOrder,
      StrategyInstance,
      PaymentState,
      ArbitrageHistory,
      MarketMakingHistory,
    ]),
  ],
  controllers: [StrategyController],
  providers: [
    StrategyService,
    ExchangeInitService,
    AlpacaStratService,
  ],
  exports: [StrategyService],
})
export class StrategyModule { }
