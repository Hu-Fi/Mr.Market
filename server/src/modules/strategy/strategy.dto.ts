// strategy.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class StrategyDto {
  @ApiProperty({ example: '123', description: 'User ID for whom the strategy is being executed.' })
  userId: string;

  @ApiProperty({ example: '456', description: 'Client ID associated with the user.' })
  clientId: string;

  @ApiProperty({ example: 'ETH/USDT', description: 'The trading pair to monitor for arbitrage opportunities.' })
  pair: string;

  @ApiProperty({ example: 1.0, description: 'The amount of the asset to trade.' })
  amountToTrade: number;

  @ApiProperty({ example: 0.01, description: 'Minimum profitability threshold as a decimal (e.g., 0.01 for 1%).' })
  minProfitability: number;

  @ApiProperty({ example: 'binance', description: 'Name of the first exchange.' })
  exchangeAName: string;

  @ApiProperty({ example: 'mexc', description: 'Name of the second exchange.' })
  exchangeBName: string;
}
