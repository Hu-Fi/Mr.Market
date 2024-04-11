import { Controller, Get, Param } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { MMOrder } from 'src/common/entities/mm-order.entity';
import { ArbitrageOrder } from 'src/common/entities/arbitrage-order.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get('/maretmaking/:userId')
  getUserOrders(@Param('userId') userId: string): Promise<MMOrder[]> {
    return this.strategyService.getUserOrders(userId);
  }

  @Get('/arbitrage/:userId')
  getUserArbitrageOrders(
    @Param('userId') userId: string,
  ): Promise<ArbitrageOrder[]> {
    return this.strategyService.getUserArbitrageOrders(userId);
  }
}