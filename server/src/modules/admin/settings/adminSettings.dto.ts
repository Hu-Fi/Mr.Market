import { ApiProperty } from '@nestjs/swagger';

export class CustomConfigDto {
  @ApiProperty({ description: 'The id of config' })
  id: number; // Singleton ID

  @ApiProperty({ description: 'The max amount of money to keep in mixin bot' })
  max_balance_mixin_bot?: string; // Max amount of money to keep in mixin bot

  @ApiProperty({
    description: 'The max amount of money to keep in single exchange API Key',
  })
  max_balance_single_api_key?: string; // Max amount of money to keep in single exchange API Key

  @ApiProperty({
    description: 'The address or info about a safe place for storing profit',
  })
  funding_account?: string; // The address or info about a safe place for storing profit

  @ApiProperty({ description: 'The spot trading fee' })
  spot_fee: string; // The spot trading fee
}
