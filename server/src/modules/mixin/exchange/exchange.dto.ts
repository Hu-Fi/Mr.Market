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
  @ApiProperty({ description: 'The id of api key' })
  apiKeyId: string;

  @ApiProperty({ description: 'The asset symbol (like BTC)' })
  symbol: string;

  @ApiProperty({ description: 'The chain of asset' })
  network: string;
}

export class ExchangeAPIKeysConfigDto {
  @ApiProperty({ description: 'The UUID used for identity API key' })
  key_id: string;

  @ApiProperty({ description: 'The ccxt identifier of exchange' })
  exchange: string;

  @ApiProperty({ description: 'The name(alias) of API key' })
  name: string;

  @ApiProperty({ description: 'The API Key' })
  api_key: string;

  @ApiProperty({ description: 'The secret' })
  api_secret: string;

  @ApiProperty({ description: 'The extra information', required: false })
  api_extra: string;
}
