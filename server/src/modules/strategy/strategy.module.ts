// src/strategy/strategy.module.ts

import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';
import { TradeModule } from '../trade/trade.module';

@Module({
  imports: [TradeModule],
  controllers: [StrategyController],
  providers: [StrategyService],
  exports: [StrategyService], // Export the service if it will be used outside this module
})
export class StrategyModule {}
