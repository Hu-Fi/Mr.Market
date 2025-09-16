import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeIndicatorStrategyDto {
  @ApiProperty({
    description: 'User ID executing the strategy',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Client ID of the strategy owner',
    example: 'clientA',
  })
  clientId: string;

  @ApiProperty({
    description: 'Exchange name (as recognized by CCXT)',
    example: 'binance',
  })
  exchangeName: string;

  @ApiProperty({ description: 'Trading pair symbol', example: 'BTC/USDT' })
  symbol: string;

  @ApiProperty({ description: 'Timeframe for candles', example: '5m' })
  timeframe: string;

  @ApiProperty({
    description: 'Number of candles to fetch per tick',
    example: 300,
  })
  lookback: number;

  @ApiProperty({ description: 'Fast EMA period', example: 20 })
  emaFast: number;

  @ApiProperty({ description: 'Slow EMA period', example: 50 })
  emaSlow: number;

  @ApiProperty({ description: 'RSI calculation period', example: 14 })
  rsiPeriod: number;

  @ApiPropertyOptional({
    description: 'RSI threshold for buys (below this value)',
    example: 35,
  })
  rsiBuyBelow?: number;

  @ApiPropertyOptional({
    description: 'RSI threshold for sells (above this value)',
    example: 65,
  })
  rsiSellAbove?: number;

  @ApiProperty({
    description: 'Indicator mode to use',
    enum: ['ema', 'rsi', 'both'],
    example: 'both',
  })
  indicatorMode: 'ema' | 'rsi' | 'both';

  @ApiPropertyOptional({
    description: 'Allowed weekdays (0=Sunday, 6=Saturday)',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  allowedWeekdays?: number[];

  @ApiPropertyOptional({
    description: 'Allowed hours (0–23)',
    example: [9, 10, 11, 15, 16],
    type: [Number],
  })
  allowedHours?: number[];

  @ApiProperty({
    description: 'Whether order size is expressed in base or quote currency',
    enum: ['base', 'quote'],
    example: 'quote',
  })
  orderMode: 'base' | 'quote';

  @ApiProperty({
    description: 'Order size (amount in base or quote, depending on orderMode)',
    example: 100,
  })
  orderSize: number;

  @ApiPropertyOptional({
    description: 'Limit price slippage in basis points (default 10 = 0.10%)',
    example: 10,
  })
  slippageBps?: number;

  @ApiPropertyOptional({
    description: 'Max concurrent positions allowed (guard)',
    example: 2,
  })
  maxConcurrentPositions?: number;

  @ApiProperty({
    description: 'Tick interval in milliseconds',
    example: 60000,
  })
  tickIntervalMs: number;
}
