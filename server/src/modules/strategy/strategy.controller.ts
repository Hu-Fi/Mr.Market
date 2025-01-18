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
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import {
  ArbitrageStrategyDto,
  ExecuteVolumeStrategyDto,
  JoinStrategyDto,
  PureMarketMakingStrategyDto,
  StopVolumeStrategyDto,
} from './strategy.dto';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { AdminStrategyService } from '../admin/strategy/adminStrategy.service';

@ApiTags('strategy')
@Controller('strategy')
export class StrategyController {
  constructor(
    private readonly strategyService: StrategyService,
    private readonly adminService: AdminStrategyService,
  ) {}

  @Get('running')
  @ApiOperation({ summary: 'Get all running strategies' })
  @ApiResponse({
    status: 200,
    description: 'A list of all currently running strategies',
    type: [StrategyInstance],
  })
  async getRunningStrategies(): Promise<StrategyInstance[]> {
    return await this.strategyService.getRunningStrategies();
  }

  @Get('all-strategies')
  @ApiOperation({ summary: 'Get all strategies' })
  @ApiResponse({
    status: 200,
    description: 'A list of all strategies, including running and stopped ones',
    type: [StrategyInstance],
  })
  async getAllStrategies(): Promise<StrategyInstance[]> {
    return await this.strategyService.getAllStrategies();
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a strategy with a contribution' })
  @ApiBody({
    description: 'Data required to join a strategy',
    type: JoinStrategyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined the strategy',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or strategy parameters',
  })
  async joinStrategy(@Body() joinStrategyDto: JoinStrategyDto) {
    const {
      userId,
      clientId,
      strategyKey,
      amount,
      transactionHash,
      tokenSymbol,
      chainId,
      tokenAddress,
    } = joinStrategyDto;

    return this.adminService.joinStrategy(
      userId,
      clientId,
      strategyKey,
      amount,
      transactionHash,
      tokenSymbol,
      chainId,
      tokenAddress,
    );
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
      strategyParamsDto.checkIntervalSeconds,
      strategyParamsDto.maxOpenOrders,
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
    return await this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'arbitrage',
    );
  }

  @Get('/market_making/history/:userId')
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

  @Get('/stop-marketmaking')
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

  @Post('/execute-volume-strategy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute volume strategy' })
  @ApiResponse({
    status: 200,
    description: 'The volume strategy has been started.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async executeVolumeStrategy(
    @Body() executeVolumeStrategyDto: ExecuteVolumeStrategyDto,
  ) {
    return this.strategyService.executeVolumeStrategy(
      executeVolumeStrategyDto.exchangeName,
      executeVolumeStrategyDto.symbol,
      executeVolumeStrategyDto.incrementPercentage,
      executeVolumeStrategyDto.intervalTime,
      executeVolumeStrategyDto.tradeAmount,
      executeVolumeStrategyDto.numTrades,
      executeVolumeStrategyDto.userId,
      executeVolumeStrategyDto.clientId,
    );
  }

  @Post('/stop-volume-strategy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop volume strategy' })
  @ApiResponse({
    status: 200,
    description: 'The volume strategy has been stopped.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async stopVolumeStrategy(
    @Body() stopVolumeStrategyDto: StopVolumeStrategyDto,
  ) {
    return this.strategyService.stopVolumeStrategy(
      stopVolumeStrategyDto.userId,
      stopVolumeStrategyDto.clientId,
    );
  }

  @Post('rerun')
  @ApiOperation({ summary: 'Rerun a saved strategy instance' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        strategyKey: {
          type: 'string',
          description: 'The unique key of the strategy instance to rerun',
          example: 'user123-client123-pureMarketMaking',
        },
      },
      required: ['strategyKey'],
    },
  })
  async rerunStrategy(@Body('strategyKey') strategyKey: string) {
    return await this.strategyService.rerunStrategy(strategyKey);
  }
}
