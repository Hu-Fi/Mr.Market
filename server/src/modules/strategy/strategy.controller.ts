// strategy.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import {
  ArbitrageStrategyDto,
  PureMarketMakingStrategyDto,
} from './strategy.dto';
import { CustomLogger } from '../logger/logger.service';

@ApiTags('strategy')
@Controller('strategy')
export class StrategyController {
  private readonly logger = new CustomLogger(StrategyController.name);
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

  @Get('/payment_stat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment state by id' })
  @ApiQuery({ name: 'order_id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'The payment state of order.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getPaymentState(@Query('order_id') orderId: string) {
    return await this.strategyUserSerive.findPaymentStateById(orderId);
  }
}

@ApiTags('arbitrage')
@Controller('strategy/arbitrage')
export class ArbitrageController {
  private readonly logger = new CustomLogger(StrategyController.name);
  constructor(
    private readonly strategyService: StrategyService,
    private readonly strategyUserSerive: StrategyUserService,
  ) {}
  @Get('/all')
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

  @Get('/arbitrage-by-id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all arbitrage by order id' })
  @ApiQuery({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the arbitrage.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getArbitrageDetailsById(@Query('id') id: string) {
    return await this.strategyUserSerive.findArbitrageByOrderId(id);
  }

  @Get('/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all arbitrage history by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All arbitrage history of user',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserArbitrageOrders(
    @Param('userId') userId: string,
  ): Promise<ArbitrageHistory[]> {
    return await this.strategyService.getUserArbitrageHistorys(userId);
  }

  @Post('/execute-arbitrage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute arbitrage strategy for a user' })
  @ApiResponse({
    status: 200,
    description: 'The arbitrage strategy has been initiated for the user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async executeArbitrage(@Body() strategyParamsDto: ArbitrageStrategyDto) {
    return this.strategyService.startArbitrageStrategyForUser(
      strategyParamsDto,
    );
  }

  @Get('/stop-arbitrage')
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
    this.logger.log(
      `Received request to stop arbitrage strategy for user ${userId}, client ${clientId}`,
    );
    const result = await this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'arbitrage',
    );
    this.logger.log(`Result of stopArbitrage: ${result}`);
    return result;
  }
}

@ApiTags('market-making')
@Controller('strategy/market-making')
export class MarketMakingController {
  private readonly logger = new CustomLogger(StrategyController.name);
  constructor(
    private readonly strategyService: StrategyService,
    private readonly strategyUserSerive: StrategyUserService,
  ) {}

  @Get('/all')
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

  @Get('/market-making-by-id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making by orderID' })
  @ApiQuery({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the market making.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getMarketMakingDetailsById(@Query('id') id: string) {
    return await this.strategyUserSerive.findMarketMakingByOrderId(id);
  }

  @Get('/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all market making history by user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'All market making history of user',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getUserOrders(
    @Query('userId') userId: string,
  ): Promise<MarketMakingHistory[]> {
    return await this.strategyService.getUserOrders(userId);
  }

  @Post('/execute-pure-market-making')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute pure market making strategy for a user' })
  @ApiResponse({
    status: 200,
    description:
      'The pure market making strategy has been initiated for the user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async executePureMarketMaking(
    @Body() strategyParamsDto: PureMarketMakingStrategyDto,
  ) {
    // Assuming strategyParamsDto includes all necessary parameters for the market making strategy
    return this.strategyService.executePureMarketMakingStrategy(
      strategyParamsDto,
    );
  }

  @Get('/stop-market-making')
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
    this.logger.log(
      `Received request to stop pure market making strategy for user ${userId}, client ${clientId}`,
    );
    const result = await this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'pureMarketMaking',
    );
    this.logger.log(`Result of stopPureMarketMaking: ${result}`);
    return result;
  }
}
