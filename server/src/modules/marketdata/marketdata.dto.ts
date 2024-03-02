import { ApiProperty } from '@nestjs/swagger';

export class TickersDto {
  @ApiProperty({ description: 'Array of exchanges' })
  exchangeNames: string[];

  @ApiProperty({ description: 'array of symbols' })
  symbols: string[];
}
