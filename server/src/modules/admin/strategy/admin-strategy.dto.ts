import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArbitrageStrategyDto,
  PureMarketMakingStrategyDto,
  ExecuteVolumeStrategyDto,
} from '../../strategy/strategy.dto';
import { IsUUID, IsDecimal } from 'class-validator';

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
    description:
      'Parameters for market making strategy (required for market making)',
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

export class GetDepositAddressDto {
  @ApiProperty({
    description: 'exchangeName',
    example: 'binance',
  })
  exchangeName: string;
  @ApiProperty({
    description: 'The token to be deposited',
    example: 'USDT',
  })
  tokenSymbol: string;
  @ApiProperty({
    description: 'The network to deposit on',
    example: 'ERC20',
  })
  network: string;
  @ApiPropertyOptional({
    description: 'default or account2',
    example: 'default',
  })
  accountLabel?: string; // Optional label for the account
}

// DTO to define the expected body structure
export class GetTokenSymbolDto {
  @ApiProperty({
    description: 'The contract address of the token (ERC-20)',
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  contractAddress: string;

  @ApiProperty({
    description:
      'The chain ID of the blockchain (e.g., 1 for Ethereum Mainnet, 56 for Binance Smart Chain)',
    example: 1,
  })
  chainId: number;
}

export class GetSupportedNetworksDto {
  @ApiProperty({
    description: 'The name of the exchange (e.g., binance, kraken, etc.)',
    example: 'binance',
  })
  exchangeName: string;

  @ApiProperty({
    description: 'The symbol of the token (e.g., BTC, ETH, USDT, etc.)',
    example: 'USDT',
  })
  tokenSymbol: string;

  @ApiPropertyOptional({
    description:
      'Optional account label, if there are multiple accounts on the exchange',
    example: 'default',
    required: false,
  })
  accountLabel?: string;
}

export class JoinStrategyDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  strategyId: string;

  @IsDecimal()
  amount: number;
}
