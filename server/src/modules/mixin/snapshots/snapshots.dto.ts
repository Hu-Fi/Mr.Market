import { ApiProperty } from '@nestjs/swagger';

export class CreateMixinWithdrawalDto {
  @ApiProperty({ description: 'The asset id of withdrawal asset' })
  asset_id: string;

  @ApiProperty({ description: 'The destination adderss' })
  destination: string;

  @ApiProperty({ description: 'The withdrawal memo, Optional' })
  memo: string;

  @ApiProperty({ description: 'The amount of withdrawal asset' })
  amount: string;
}
