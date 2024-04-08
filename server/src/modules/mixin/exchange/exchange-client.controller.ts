// These endpoints are used for getting spot related data for user
// TODO: Add jwt auth layer

import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from './exchange.service';
import { SpotOrderDetails } from "src/common/types/orders/details";

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
  async getDepositAddress(@Param('order_id') orderId: string): Promise<SpotOrderDetails> {
    try {
      return {
        ...(await this.exchagneService.readOrderById(orderId)),
        amount: `${Math.random()}`, // TODO determine where should it come from
        price: `${Math.random()}`, // TODO determine where should it come from
        avg: `${Math.random()}`, // TODO determine where should it come from
        filled: `${Math.random()}`, // TODO determine where should it come from
        pay: `${Math.random()}`, // TODO determine where should it come from
        fee: `${Math.random()}`, // TODO determine where should it come from
        receive:`${Math.random()}`, // TODO determine where should it come from
      };
    } catch (e) {
      this.logger.error(`Get order by id error: ${e.message}`);
    }
  }
}
