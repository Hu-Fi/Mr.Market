// These endpoints are used for getting spot related data for user
// TODO: Add jwt auth layer

import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { ExchangeService } from './exchange.service';

@ApiTags('exchange')
@Controller('exchange')
export class ExchangeUserController {
  private readonly logger = new CustomLogger(ExchangeUserController.name);

  constructor(private readonly exchagneService: ExchangeService) {}

  @Get('orders/user/:user_id')
  @ApiOperation({ summary: 'Get all orders by user id' })
  @ApiResponse({ status: 200, description: 'Get all orders of an user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getOrdersByUser(@Param('user_id') userId: string) {
    try {
      return this.exchagneService.readOrdersByUser(userId);
    } catch (e) {
      this.logger.error(`Get orders by user error: ${e.message}`);
    }
  }

  @Get('orders/order/:order_id')
  @ApiOperation({ summary: 'Get order details by id' })
  @ApiResponse({ status: 200, description: 'Get order details by id' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDepositAddress(@Param('order_id') orderId: string) {
    try {
      return this.exchagneService.readOrderById(orderId);
    } catch (e) {
      this.logger.error(`Get order by id error: ${e.message}`);
    }
  }
}
