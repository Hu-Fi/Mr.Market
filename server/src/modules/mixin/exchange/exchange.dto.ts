import { ApiProperty } from '@nestjs/swagger';

export class ExchangeWithdrawalDto {
  @ApiProperty({ description: 'The name of exchange' })
  exchange: string;

  @ApiProperty({ description: 'The id of api key' })
  apiKeyId: string;

  @ApiProperty({ description: 'The asset symbol (like BTC)' })
  symbol: string;

  @ApiProperty({ description: 'The chain of asset' })
  network: string;

  @ApiProperty({ description: 'Recipient address' })
  address: string;

  @ApiProperty({ description: 'Memo' })
  tag: string;

  @ApiProperty({ description: 'Withdrawal amount' })
  amount: string;
}

export class ExchangeDepositDto {
  @ApiProperty({ description: 'The name of exchange' })
  exchange: string;

  @ApiProperty({ description: 'The id of api key' })
  apiKeyId: string;

  @ApiProperty({ description: 'The asset symbol (like BTC)' })
  symbol: string;

  @ApiProperty({ description: 'The chain of asset' })
  network: string;
}
