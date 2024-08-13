// strategy.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';

export class ArbitrageStrategyDto {
  @ApiProperty({
    example: '123',
    description: 'User ID for whom the strategy is being executed.',
  })
  userId: string;

  @ApiProperty({
    example: '456',
    description: 'Client ID associated with the user.',
  })
  clientId: string;

  @ApiProperty({
    example: 'ETH/USDT',
    description: 'The trading pair to monitor for arbitrage opportunities.',
  })
  pair: string;

  @ApiProperty({
    example: 1.0,
    description: 'The amount of the asset to trade.',
  })
  amountToTrade: number;

  @ApiProperty({
    example: 0.01,
    description:
      'Minimum profitability threshold as a decimal (e.g., 0.01 for 1%).',
  })
  minProfitability: number;

  @ApiProperty({
    example: 'binance',
    description: 'Name of the first exchange.',
  })
  exchangeAName: string;

  @ApiProperty({ example: 'mexc', description: 'Name of the second exchange.' })
  exchangeBName: string;
  @ApiProperty({ example: 10, description: 'interval to run arbitrage scan' })
  checkIntervalSeconds?: number;
  @ApiProperty({ example: 1, description: 'Max number of orders' })
  maxOpenOrders?: number;
}

export class PureMarketMakingStrategyDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Client ID' })
  clientId: string;

  @ApiProperty({ description: 'Trading pair', example: 'BTC/USD' })
  pair: string;

  @ApiProperty({ description: 'Exchange name', example: 'binance' })
  exchangeName: string;

  @ApiProperty({ description: 'Bid spread as a percentage', example: 0.1 })
  bidSpread: number;

  @ApiProperty({ description: 'Ask spread as a percentage', example: 0.1 })
  askSpread: number;

  @ApiProperty({ description: 'Order amount', example: 0.1 })
  orderAmount: number;

  @ApiProperty({
    description: 'Order refresh time in milliseconds',
    example: 15000,
  })
  orderRefreshTime: number;

  @ApiProperty({
    description: 'Number of orders you want to place on both sides',
    example: 1,
  })
  numberOfLayers: number;

  @ApiProperty({
    description:
      'Price source type (mid_price, best_bid, best_ask, last_price)',
    example: 'mid_price',
  })
  priceSourceType: PriceSourceType;

  @ApiProperty({
    description:
      'Amount that increases on each layer, Set to 0 for same amount',
    example: 1,
  })
  amountChangePerLayer: number; // This can be a fixed amount or a percentage

  @ApiProperty({
    description:
      'How the amountChangePerLayer should be interpreted (fixed, percentage)',
    example: 'percentage',
  })
  amountChangeType: 'fixed' | 'percentage';

  @ApiProperty({
    description: 'Ceiling Price, No orders above this price',
    example: '0',
  })
  ceilingPrice?: number;

  @ApiProperty({
    description: 'Floor price, No orders below this price.',
    example: '0',
  })
  floorPrice?: number;
}

export class ExecuteVolumeStrategyDto {
  @ApiProperty({ description: 'Name of the exchange' })
  exchangeName: string;

  @ApiProperty({ description: 'Symbol to trade' })
  symbol: string;

  @ApiProperty({ description: 'Percentage increment for each trade' })
  incrementPercentage: number;

  @ApiProperty({ description: 'Time interval between trade execution' })
  intervalTime: number;

  @ApiProperty({ description: 'Amount to trade per order' })
  tradeAmount: number;

  @ApiProperty({ description: 'Number of trades to execute' })
  numTrades: number;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Client ID' })
  clientId: string;
}

export class StopVolumeStrategyDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Client ID' })
  clientId: string;
}
