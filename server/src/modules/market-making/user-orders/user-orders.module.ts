import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrdersController } from './user-orders.controller';
import { UserOrdersService } from './user-orders.service';
import { StrategyModule } from '../strategy/strategy.module';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from 'src/common/entities/strategy-user.entity';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ArbitrageOrder,
      MarketMakingOrder,
      PaymentState,
      SimplyGrowOrder,
      MarketMakingHistory,
      ArbitrageHistory,
    ]),
    forwardRef(() => StrategyModule),
  ],
  controllers: [UserOrdersController],
  providers: [UserOrdersService],
  exports: [UserOrdersService],
})
export class UserOrdersModule { }
