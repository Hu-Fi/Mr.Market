import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddAPIKeyDto {
  @ApiProperty({ description: 'The name of exchange' })
  @IsString()
  @IsNotEmpty()
  exchange: string;

  @ApiProperty({ description: 'The index used in the exchange map', required: false })
  exchange_index: string;

  @ApiProperty({ description: 'The name(alias) of API key' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The API Key' })
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @ApiProperty({ description: 'The secret' })
  @IsString()
  @IsNotEmpty()
  api_secret: string;
}
