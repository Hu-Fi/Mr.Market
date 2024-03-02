// strategy.controller.ts
import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';
import { ArbitrageStrategyDto, PureMarketMakingStrategyDto } from './strategy.dto';

@ApiTags('strategy')
@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post('/execute-arbitrage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute arbitrage strategy for a user' })
  @ApiResponse({
    status: 200,
    description: 'The arbitrage strategy has been initiated for the user.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })

  async executeArbitrage(@Body() strategyParamsDto: ArbitrageStrategyDto) {
    return this.strategyService.startArbitrageStrategyForUser(strategyParamsDto);

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
    return this.strategyService.stopStrategyForUser(userId, clientId,'Arbitrage');
  }


  @Post('/execute-pure-market-making')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute pure market making strategy for a user' })
  @ApiResponse({ status: 200, description: 'The pure market making strategy has been initiated for the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async executePureMarketMaking(@Body() strategyParamsDto: PureMarketMakingStrategyDto) {
    // Assuming strategyParamsDto includes all necessary parameters for the market making strategy
    return this.strategyService.executePureMarketMakingStrategy(strategyParamsDto);
  }

  @Get('/stop-pure-market-making')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop pure market making strategy for a user' })
  @ApiQuery({ name: 'userId', type: String, description: 'User ID' })
  @ApiQuery({ name: 'clientId', type: String, description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'The pure market making strategy has been stopped for the user.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async stopPureMarketMaking(
    @Query('userId') userId: string,
    @Query('clientId') clientId: string
  ) {
    // This assumes you have a method in StrategyService to stop strategies by type
    return this.strategyService.stopStrategyForUser(userId, clientId, 'pureMarketMaking');
  }

  @Get('/supported-exchanges')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of supported exchanges' })
  @ApiResponse({ status: 200, description: 'List of supported exchanges.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getSupportedExchanges() {
    return this.strategyService.getSupportedExchanges();
  }
}
