import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArbitrageStrategyDto,
  PureMarketMakingStrategyDto,
  ExecuteVolumeStrategyDto,
} from '../strategy/strategy.dto';

// Unified DTO for starting strategies that handles all types
export class StartStrategyDto {
  @ApiProperty({
    description: 'Type of strategy to start',
    example: 'arbitrage',
  })
  strategyType: 'arbitrage' | 'marketMaking' | 'volume';

  @ApiPropertyOptional({
    description: 'Parameters for arbitrage strategy (required for arbitrage)',
    type: ArbitrageStrategyDto,
  })
  arbitrageParams?: ArbitrageStrategyDto;

  @ApiPropertyOptional({
    description: 'Parameters for market making strategy (required for market making)',
    type: PureMarketMakingStrategyDto,
  })
  marketMakingParams?: PureMarketMakingStrategyDto;

  @ApiPropertyOptional({
    description: 'Parameters for volume strategy (required for volume)',
    type: ExecuteVolumeStrategyDto,
  })
  volumeParams?: ExecuteVolumeStrategyDto;

  @ApiPropertyOptional({
    description: 'Check interval in seconds (arbitrage-specific)',
    example: 10,
  })
  checkIntervalSeconds?: number;

  @ApiPropertyOptional({
    description: 'Max open orders (arbitrage-specific)',
    example: 5,
  })
  maxOpenOrders?: number;
}

// Stop Strategy DTO for stopping a strategy
export class StopStrategyDto {
    @ApiProperty({
      description: 'User ID associated with the strategy',
      example: '123',
    })
    userId: string;
  
    @ApiProperty({
      description: 'Client ID associated with the strategy',
      example: '456',
    })
    clientId: string;
  
    @ApiProperty({
      description: 'Type of strategy to stop',
      example: 'arbitrage',
    })
    strategyType: 'arbitrage' | 'marketMaking' | 'volume';
  }