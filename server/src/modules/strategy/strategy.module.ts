// src/strategy/strategy.module.ts

import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { TradeModule } from '../trade/trade.module';
import { PerformanceModule } from '../performance/performance.module';
import { LoggerModule } from '../logger/logger.module';
import { StrategyUserService } from './strategy-user.service';
import { StrategyUserRepository } from './strategy-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
} from 'src/common/entities/strategy.entity';
import { ConfigModule } from '@nestjs/config';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { AlpacaStratService } from './alpacastrat.service';

@Module({
  imports: [
    TradeModule,
    PerformanceModule,
    LoggerModule,
    ExchangeInitModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      ArbitrageOrder,
      MarketMakingOrder,
      PaymentState,
      ArbitrageHistory,
      MarketMakingHistory,
    ]),
  ],
  controllers: [StrategyController],
  providers: [
    StrategyService,
    StrategyUserService,
    StrategyUserRepository,
    ExchangeInitService,
    AlpacaStratService,
  ],
  exports: [StrategyService, StrategyUserService, StrategyUserRepository],
})
export class StrategyModule {}
