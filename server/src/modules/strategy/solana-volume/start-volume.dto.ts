import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class StartVolumeDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'clientA' })
  @IsString()
  clientId!: string;

  @ApiProperty({ example: 'https://api.mainnet-beta.solana.com' })
  @IsString()
  rpcUrl!: string;


  @ApiProperty({ description: 'Input SPL mint', example: 'So11111111111111111111111111111111111111112' })
  @IsString()
  inputMint!: string;

  @ApiProperty({ description: 'Output SPL mint', example: 'So11111111111111111111111111111111111111112' })
  @IsString()
  outputMint!: string;

  @ApiProperty({ description: 'Base trade amount (atomic units of input mint)', example: 1_000_000 })
  @IsInt()
  @Min(1)
  baseTradeAmount!: number;

  @ApiProperty({ description: 'Number of trades to execute', example: 30 })
  @IsInt()
  @Min(1)
  numTrades!: number;

  @ApiProperty({ description: 'Base interval (seconds) between trades', example: 15 })
  @IsInt()
  @Min(1)
  baseIntervalTime!: number;

  @ApiProperty({ description: 'Slippage in bps (e.g. 50 = 0.5%)', example: 50 })
  @IsInt()
  @Min(0)
  slippageBps!: number;

  @ApiProperty({ description: 'Reserved for price push logic', example: 0 })
  @IsNumber()
  pricePushRate!: number;

  @ApiPropertyOptional({ description: 'Max loss threshold in SOL', example: 0.25 })
  @IsOptional()
  @IsNumber()
  maxLossThreshold?: number;
}
