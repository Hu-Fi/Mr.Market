import { ApiProperty } from '@nestjs/swagger';

export class BroadcastMessageDto {
  @ApiProperty({ description: 'The text message to broadcast' })
  message: string;
}

export class PrivateMessageDto {
  @ApiProperty({ description: 'The text message to send' })
  message: string;

  @ApiProperty({ description: 'The user id of message receiver' })
  user_id: string;
}