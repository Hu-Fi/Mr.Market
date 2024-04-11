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
import { Order } from 'src/common/entities/order.entity';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    TradeModule,
    PerformanceModule,
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      ArbitrageOrder,
      MarketMakingOrder,
      PaymentState,
      Order,
    ]),
  ],
  controllers: [StrategyController, OrdersController],
  providers: [StrategyService, StrategyUserService, StrategyUserRepository],
  exports: [StrategyService, StrategyUserService, StrategyUserRepository],
})
export class StrategyModule {}
