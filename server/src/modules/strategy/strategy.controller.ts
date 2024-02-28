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
import { StrategyDto } from './strategy.dto';

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
  async executeArbitrage(@Body() strategyParamsDto: StrategyDto) {
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
    return this.strategyService.stopArbitrageStrategyForUser(userId, clientId);
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
