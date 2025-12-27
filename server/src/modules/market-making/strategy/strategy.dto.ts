// strategy.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';

export class JoinStrategyDto {
  @ApiProperty({ description: 'User ID', example: 'user123' })
  userId: string;

  @ApiProperty({ description: 'Client ID', example: 'client123' })
  clientId: string;

  @ApiProperty({
    description: 'Strategy Key',
    example: 'user123-client123-arbitrage',
  })
  strategyKey: string;

  @ApiProperty({ description: 'Amount contributed', example: 100.0 })
  amount: number;

  @ApiProperty({ description: 'Transaction Hash', example: '0xabc123...' })
  transactionHash: string;

  @ApiProperty({ description: 'Token Symbol', example: 'USDT' })
  tokenSymbol: string;

  @ApiProperty({ description: 'Chain ID', example: 1 })
  chainId: number;

  @ApiProperty({
    description: 'Token Contract Address',
    example: '0xabc123...',
  })
  tokenAddress: string;
}

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

  @ApiProperty({ description: 'Trading pair', example: 'BTC/USDT' })
  pair: string;

  @ApiProperty({
    description: 'Exchange name used for execution',
    example: 'binance',
  })
  exchangeName: string;

  @ApiPropertyOptional({
    description:
      'If provided, this exchange is used as an oracle for price data instead of `exchangeName`',
    example: 'mexc',
  })
  oracleExchangeName?: string; // <--- NEW optional param

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
      'Price source type (MID_PRICE, BEST_BID, BEST_ASK, LAST_PRICE)',
    example: 'MID_PRICE',
    enum: PriceSourceType,
  })
  priceSourceType: PriceSourceType;

  @ApiProperty({
    description:
      'Amount that increases on each layer, set to 0 for same amount',
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
    description: 'Ceiling Price, no buy orders above this price',
    example: '0',
    required: false,
  })
  ceilingPrice?: number;

  @ApiProperty({
    description: 'Floor price, no sell orders below this price.',
    example: '0',
    required: false,
  })
  floorPrice?: number;
}

export class ExecuteVolumeStrategyDto {
  @ApiProperty({ description: 'Name of the exchange' })
  exchangeName: string;

  @ApiProperty({ description: 'Symbol to trade' })
  symbol: string;

  @ApiProperty({
    description:
      'Percentage increment for offsetting from midPrice (initial offset)',
  })
  incrementPercentage: number;

  @ApiProperty({
    description: 'Time interval (in seconds) between each trade execution',
  })
  intervalTime: number;

  @ApiProperty({ description: 'Base amount to trade per order' })
  tradeAmount: number;

  @ApiProperty({ description: 'Number of total trades to execute' })
  numTrades: number;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Client ID' })
  clientId: string;

  @ApiProperty({
    description:
      'Rate at which to push the price upward after each successful trade, in percent',
    example: 1,
  })
  pricePushRate: number; // <--- NEW PARAM to push price after each trade
}

export class StopVolumeStrategyDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Client ID' })
  clientId: string;
}
