import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
// import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StrategyUserService } from './strategy-user.service';

@ApiTags('strategy-user')
@Controller('strategy-user')
export class StrategyUserController {
  constructor(private readonly strategyUserService: StrategyUserService) {}

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
    return await this.strategyUserService.findAllStrategyByUser(userId);
  }

  @Get('/payment_state/:order_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment state by id' })
  @ApiResponse({
    status: 200,
    description: 'The payment state of order.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getPaymentState(@Param('order_id') orderId: string) {
    return await this.strategyUserService.findPaymentStateById(orderId);
  }

  @Get('/simply_grow/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all simply grow orders by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All simply grow orders of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getSimplyGrowByUserId(@Query('user_id') userId: string) {
    return await this.strategyUserService.findSimplyGrowByUserId(userId);
  }

  @Get('/simply_grow/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get simply grow order by id' })
  @ApiQuery({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the simply grow order.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getSimplyGrowByOrderId(@Param('id') id: string) {
    return await this.strategyUserService.findSimplyGrowByOrderId(id);
  }

  @Get('/arbitrage/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all arbitrage by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All arbitrage order of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getAllArbitrageByUser(@Query('userId') userId: string) {
    return await this.strategyUserService.findArbitrageByUserId(userId);
  }

  @Get('/arbitrage/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all arbitrage by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the arbitrage.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getArbitrageDetailsById(@Param('id') id: string) {
    return await this.strategyUserService.findArbitrageByOrderId(id);
  }

  // @Get('/arbitrage/history/:userId')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get all arbitrage history by user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'All arbitrage history of user',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // async getUserArbitrageOrders(
  //   @Param('userId') userId: string,
  // ): Promise<ArbitrageHistory[]> {
  //   return await this.strategyUserService.getUserArbitrageHistory(userId);
  // }

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
    return await this.strategyUserService.findMarketMakingByUserId(userId);
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
    return await this.strategyUserService.findMarketMakingByOrderId(id);
  }
}
