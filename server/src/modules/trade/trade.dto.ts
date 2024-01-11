import { ApiProperty } from '@nestjs/swagger';

export class MarketTradeDto {
  
  @ApiProperty({ description: 'Identifier for the sub-user' })
  userId: string;

  @ApiProperty({ description: 'Identifier for the client' })
  clientId: string;

  @ApiProperty({ description: 'Exchange'})
  exchange: string;

  @ApiProperty({ description: 'Symbol for the trade (e.g., BTC/USD)' })
  symbol: string;

  @ApiProperty({ description: 'Side of the trade (buy or sell)', enum: ['buy', 'sell'] })
  side: string;

  @ApiProperty({ description: 'Amount to trade' })
  amount: number;
}

export class LimitTradeDto {
  @ApiProperty({ description: 'Identifier for the sub-user' })
  userId: string;

  @ApiProperty({ description: 'Identifier for the client' })
  clientId: string;

  @ApiProperty({ description: 'Exchange'})
  exchange: string;

  @ApiProperty({ description: 'Symbol for the trade (e.g., BTC/USD)' })
  symbol: string;

  @ApiProperty({ description: 'Side of the trade (buy or sell)', enum: ['buy', 'sell'] })
  side: string;

  @ApiProperty({ description: 'Amount to trade' })
  amount: number;

  @ApiProperty({ description: 'Price at which the trade should be executed' })
  price: number;
}
