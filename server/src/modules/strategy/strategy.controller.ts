// strategy.controller.ts
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('strategy')
@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  // Get all strategy by user

  // Stop arbitrage by id
  // Get all arbitrage by user
  // Get arbitrage details by id

  // Stop market making by id
  // Get all market making by user
  // Get market making details by id

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
    return this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      'Arbitrage',
    );
  }

  @Get('/stop-pure-market-making')
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

  // We shouldn't expose these endpoints if we don't need to do them directly
  // For mixin side we will only call from snapshot service
  //
  // @Post('/execute-arbitrage')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Execute arbitrage strategy for a user' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The arbitrage strategy has been initiated for the user.',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // async executeArbitrage(@Body() strategyParamsDto: ArbitrageStrategyDto) {
  //   return this.strategyService.startArbitrageStrategyForUser(
  //     strategyParamsDto,
  //   );
  // }

  // @Post('/execute-pure-market-making')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Execute pure market making strategy for a user' })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'The pure market making strategy has been initiated for the user.',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // async executePureMarketMaking(
  //   @Body() strategyParamsDto: PureMarketMakingStrategyDto,
  // ) {
  //   // Assuming strategyParamsDto includes all necessary parameters for the market making strategy
  //   return this.strategyService.executePureMarketMakingStrategy(
  //     strategyParamsDto,
  //   );
  // }

  // @Get('/supported-exchanges')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get list of supported exchanges' })
  // @ApiResponse({ status: 200, description: 'List of supported exchanges.' })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // async getSupportedExchanges() {
  //   return this.strategyService.getSupportedExchanges();
  // }
}
