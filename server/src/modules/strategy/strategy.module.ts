// src/strategy/strategy.module.ts

import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { TradeModule } from '../trade/trade.module';
import { PerformanceModule } from '../performance/performance.module';
import { LoggerModule } from '../logger/logger.module';
import { StrategyUserService } from './strategy-user.service';

@Module({
  imports: [TradeModule, PerformanceModule, LoggerModule],
  controllers: [StrategyController],
  providers: [StrategyService, StrategyUserService],
  exports: [StrategyService, StrategyUserService],
})
export class StrategyModule {}
