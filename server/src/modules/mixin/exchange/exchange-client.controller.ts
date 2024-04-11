// These endpoints are used for getting spot related data for user
// TODO: Add jwt auth layer

import {Controller, Get, HttpException, Param} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from './exchange.service';
import { SpotOrderDetails } from "src/common/types/orders/details";
import {STATE_CODE_MAP} from "../../../common/types/orders/states";
import BigNumber from "bignumber.js";

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
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDepositAddress(@Param('order_id') orderId: string): Promise<SpotOrderDetails> {
    if (!await this.exchagneService.exists(orderId)) {
      throw new HttpException(
        'Order not found',
        404,
      );
    }
    try {
      const order = await this.exchagneService.readOrderById(orderId);
      const completed = STATE_CODE_MAP[order.state] === 'ORDER_SUCCESS';
      const price = completed ? BigNumber(order.receiveAmount).div(BigNumber(order.amount)).toString() : '';

      return {
        ...order,
        price,
        avg: price,
        filled: order.type[0] === 'M' ? order.receiveAmount : order.limitFilled,
        pay: order.amount,
        fee: BigNumber(order.amount).multipliedBy(2).div(1000).toString(),
        receive: order.receiveAmount
      };
    } catch (e) {
      this.logger.error(`Get order by id error: ${e.message}`);
    }
  }
}
