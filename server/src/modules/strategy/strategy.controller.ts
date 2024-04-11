// strategy.controller.ts
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';

@ApiTags('strategy')
@Controller('strategy')
export class StrategyController {
  constructor(
    private readonly strategyService: StrategyService,
    private readonly strategyUserSerive: StrategyUserService,
  ) {}

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
    return await this.strategyUserSerive.findAllStrategyByUser(userId);
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
    return await this.strategyUserSerive.findPaymentStateById(orderId);
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
    return await this.strategyUserSerive.findArbitrageByUserId(userId);
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
    return await this.strategyUserSerive.findArbitrageByOrderId(id);
  }

  @Get('/arbitrage/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop arbitrage strategy for a user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiQuery({ name: 'clientId', type: String, description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description: 'The arbitrage strategy has been stopped for the user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async stopArbitrage(
    @Query('userId') userId: string,
    @Query('clientId') clientId: string,
  ) {
    return await this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'arbitrage',
    );
  }

  @Get('/market_making/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All market making order of user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getAllMarketMakingByUser(@Query('userId') userId: string) {
    return await this.strategyUserSerive.findMarketMakingByUserId(userId);
  }

  @Get('/market_making/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the market making.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getMarketMakingDetailsById(@Param('id') id: string) {
    return await this.strategyUserSerive.findMarketMakingByOrderId(id);
  }

  @Get('/market_making/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop pure market making strategy for a user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiQuery({ name: 'clientId', type: String, description: 'Client ID' })
  @ApiResponse({
    status: 200,
    description:
      'The pure market making strategy has been stopped for the user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async stopPureMarketMaking(
    @Query('userId') userId: string,
    @Query('clientId') clientId: string,
  ) {
    // This assumes you have a method in StrategyService to stop strategies by type
    return this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'pureMarketMaking',
    );
  }
}
