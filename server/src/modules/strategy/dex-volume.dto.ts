// dex-volume.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { DexId } from 'src/defi/addresses';

export class DexVolumeStrategyDto {
  @ApiProperty({
    description: 'User ID initiating the strategy',
    example: 'user_123',
  })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'Client/workspace ID', example: 'client_A' })
  @IsString()
  clientId!: string;

  @ApiProperty({
    description: 'Which DEX adapter to use',
    // If you have a DexId type/enum exported elsewhere, change enumName and enum accordingly:
    enum: ['uniswapV3', 'pancakeV3'],
    example: 'uniswapV3',
  })
  @IsString()
  @IsIn(['uniswapV3', 'pancakeV3'])
  dexId!: DexId;

  @ApiProperty({ description: 'EVM chain ID', example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  chainId!: number;

  @ApiProperty({
    description: 'RPC URL for provider',
    example: 'https://mainnet.infura.io/v3/<key>',
  })
  @IsString()
  rpcUrl!: string;

  @ApiProperty({
    description: 'Primary signer private key (0x-prefixed)',
    example:
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  })
  @IsString()
  @Matches(/^0x[0-9a-fA-F]{64}$/, {
    message: 'signerPk1 must be a 0x-prefixed 32-byte hex string',
  })
  signerPk1!: string;

  @ApiPropertyOptional({
    description: 'Optional secondary signer private key (0x-prefixed)',
    example:
      '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  })
  @IsOptional()
  @IsString()
  @Matches(/^0x[0-9a-fA-F]{64}$/, {
    message: 'signerPk2 must be a 0x-prefixed 32-byte hex string',
  })
  signerPk2?: string;

  @ApiProperty({
    description: 'Token in (ERC-20 address)',
    example: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  })
  @IsString()
  tokenIn!: string;

  @ApiProperty({
    description: 'Token out (ERC-20 address)',
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  @IsString()
  tokenOut!: string;

  @ApiProperty({
    description: 'Uniswap V3-like pool fee tier (in ppm)',
    enum: [500, 3000, 10000],
    example: 500,
  })
  @Type(() => Number)
  @IsInt()
  @IsIn([500, 3000, 10000])
  feeTier!: 500 | 3000 | 10000;

  @ApiProperty({
    description: 'Base amount in (human string in tokenIn units)',
    example: '250.5',
  })
  @IsString()
  baseAmountIn!: string;

  @ApiPropertyOptional({
    description: '±Jitter on base amount (%)',
    example: 5,
    default: 5,
    minimum: 0,
    maximum: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  amountJitterPct?: number;

  @ApiProperty({
    description: 'How many cycles to run',
    example: 50,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  numCycles!: number;

  @ApiProperty({
    description: 'Base interval between cycles (seconds)',
    example: 30,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  baseIntervalSec!: number;

  @ApiPropertyOptional({
    description: '±Jitter on interval (%)',
    example: 20,
    default: 20,
    minimum: 0,
    maximum: 100,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  intervalJitterPct?: number;

  @ApiProperty({
    description: 'Max slippage (basis points)',
    example: 30,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  slippageBps!: number;

  @ApiProperty({
    description: 'Max price impact per swap (%)',
    example: 0.3,
    minimum: 0,
    maximum: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxPriceImpactPct!: number;

  @ApiPropertyOptional({
    description: 'Max gas cost per hop in quote token',
    example: 1.25,
    minimum: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxGasCostInQuote?: number;

  @ApiPropertyOptional({
    description:
      'Native gas token price in quote token (e.g., ETH priced in USDC)',
    example: 3200.5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  gasTokenPriceInQuote?: number;

  @ApiPropertyOptional({
    description: 'Swap deadline in seconds from now',
    example: 90,
    default: 90,
    minimum: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  deadlineSec?: number;

  @ApiPropertyOptional({
    description: 'If true, simulate only (no on-chain tx)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
