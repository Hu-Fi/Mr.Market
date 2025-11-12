import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SolanaVolumeStrategyService } from './solana-volume-strategy.service';
import { StartVolumeDto } from './start-volume.dto';
import { StopVolumeDto } from './stop-volume.dto';
import { VolumeStrategyConfig } from './solana-volume.types';
import { parsePrivateKeyToUint8Array } from 'src/common/helpers/key-utils';

@ApiTags('Solana Volume')
@Controller('solana-volume')
export class SolanaVolumeStrategyController {
  constructor(private readonly svc: SolanaVolumeStrategyService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a Solana volume strategy' })
  @ApiBody({ type: StartVolumeDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        strategyKey: { type: 'string' },
        status: { type: 'string', example: 'started' },
      },
    },
  })
  async start(@Body() dto: StartVolumeDto) {
    const config: VolumeStrategyConfig = {
      userId: dto.userId,
      clientId: dto.clientId,
      rpcUrl: dto.rpcUrl,
      inputMint: dto.inputMint,
      outputMint: dto.outputMint,
      baseTradeAmount: dto.baseTradeAmount,
      numTrades: dto.numTrades,
      baseIntervalTime: dto.baseIntervalTime,
      slippageBps: dto.slippageBps,
      pricePushRate: dto.pricePushRate,
      maxLossThreshold: dto.maxLossThreshold,
    };

    const { strategyKey } = await this.svc.startVolumeStrategy(config);
    return { strategyKey, status: 'started' };
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop a running strategy' })
  @ApiBody({ type: StopVolumeDto })
  @ApiOkResponse({ schema: { properties: { status: { type: 'string', example: 'stopped' } } } })
  async stop(@Body() dto: StopVolumeDto) {
    await this.svc.stopVolumeStrategy(dto.userId, dto.clientId);
    return { status: 'stopped' };
  }

  @Get('running')
  @ApiOperation({ summary: 'List running strategies (strategy keys)' })
  @ApiOkResponse({ schema: { type: 'array', items: { type: 'string' } } })
  running() {
    return this.svc.getRunningStrategies();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get strategy status (sanitized)' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        isRunning: { type: 'boolean' },
        tradesExecuted: { type: 'number' },
        useWalletAAsBuyer: { type: 'boolean' },
        initialBalances: {
          type: 'object',
          properties: {
            walletA: { type: 'number', description: 'lamports' },
            walletB: { type: 'number', description: 'lamports' },
          },
        },
        consecutiveErrors: { type: 'number' },
      },
    },
  })
  status(@Query('userId') userId: string, @Query('clientId') clientId: string) {
    return this.svc.getStrategyStatus(userId, clientId);
  }

  @Get('price')
  @ApiOperation({ summary: 'Get current price for the configured pair' })
  @ApiOkResponse({ schema: { type: 'number', description: 'Price of 1 input token in output token units' } })
  async price(@Query('userId') userId: string, @Query('clientId') clientId: string) {
    const price = await this.svc.getCurrentPrice(userId, clientId);
    return price;
  }
}
