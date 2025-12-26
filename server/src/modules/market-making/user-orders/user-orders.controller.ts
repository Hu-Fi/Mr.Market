import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserOrdersService } from './user-orders.service';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';

@ApiTags('Trading Engine')
@Controller('user-orders')
export class UserOrdersController {
  constructor(private readonly userOrdersService: UserOrdersService) { }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all strategy by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All strategies of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getAllStrategy(@Query('userId') userId: string) {
    return await this.userOrdersService.findAllStrategyByUser(userId);
  }

  @Get('/payment-state/:order_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment state by id' })
  @ApiResponse({
    status: 200,
    description: 'The payment state of order.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getPaymentState(@Param('order_id') orderId: string) {
    return await this.userOrdersService.findPaymentStateById(orderId);
  }

  @Get('/simply-grow/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all simply grow orders by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All simply grow orders of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getSimplyGrowByUserId(@Query('user_id') userId: string) {
    return await this.userOrdersService.findSimplyGrowByUserId(userId);
  }

  @Get('/simply-grow/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simply grow order by id' })
  @ApiQuery({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the simply grow order.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getSimplyGrowByOrderId(@Param('id') id: string) {
    return await this.userOrdersService.findSimplyGrowByOrderId(id);
  }

  @Get('/market-making/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All market making order of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getAllMarketMakingByUser(@Query('userId') userId: string) {
    return await this.userOrdersService.findMarketMakingByUserId(userId);
  }

  @Get('/market-making/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the market making.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getMarketMakingDetailsById(@Param('id') id: string) {
    return await this.userOrdersService.findMarketMakingByOrderId(id);
  }

  @Get('/market-making/history/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making history by user' })
  @ApiResponse({
    status: 200,
    description: 'All market making history of user',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserOrders(
    @Param('userId') userId: string,
  ): Promise<MarketMakingHistory[]> {
    return await this.userOrdersService.getUserOrders(userId);
  }
}
