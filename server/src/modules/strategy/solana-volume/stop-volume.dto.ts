import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StopVolumeDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'clientA' })
  @IsString()
  clientId!: string;
}
