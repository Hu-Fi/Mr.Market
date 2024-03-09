import { ApiProperty } from '@nestjs/swagger';

export class AdminPasswordDto {
  @ApiProperty({ description: 'Password' })
  password: string;
}
