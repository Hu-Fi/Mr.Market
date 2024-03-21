import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CustomLogger } from 'src/modules/logger/logger.service';
import {
  BroadcastMessageDto,
  PrivateMessageDto,
  RemoveMessagesDto,
} from './message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  private readonly logger = new CustomLogger(MessageController.name);

  constructor(private readonly messageService: MessageService) {}

  @Post('/broadcast')
  @ApiOperation({ summary: 'Broadcast message to all users' })
  @ApiResponse({ status: 200, description: 'Broadcast successfully.' })
  @ApiBadRequestResponse({ description: 'Broadcast failed.' })
  async broadcastMessage(@Body() broadcastMessageDto: BroadcastMessageDto) {
    if (!broadcastMessageDto.message) {
      throw new BadRequestException('Invalid broadcast message parameters.');
    }
    try {
      return await this.messageService.broadcastTextMessage(
        broadcastMessageDto.message,
      );
    } catch (e) {
      this.logger.error(`Error broadcasting message: ${e.message}`);
      throw e;
    }
  }

  @Post('/pm')
  @ApiOperation({ summary: 'Private message to specific user' })
  @ApiResponse({ status: 200, description: 'Message sent successfully.' })
  @ApiBadRequestResponse({ description: 'Send message failed.' })
  async privateMessage(@Body() privateMessageDto: PrivateMessageDto) {
    if (!privateMessageDto.message || !privateMessageDto.user_id) {
      throw new BadRequestException('Invalid private message parameters.');
    }
    try {
      return await this.messageService.sendTextMessage(
        privateMessageDto.user_id,
        privateMessageDto.message,
      );
    } catch (e) {
      this.logger.error(`Error sending priavet message: ${e.message}`);
      throw e;
    }
  }

  @Post('/remove_messages')
  @ApiOperation({ summary: 'Remove messages' })
  @ApiResponse({ status: 200, description: 'Messages remove successfully.' })
  @ApiBadRequestResponse({ description: 'remove messages failed.' })
  async removeMessages(@Body() removeMessagesDto: RemoveMessagesDto) {
    if (!removeMessagesDto.message_ids) {
      throw new BadRequestException('Invalid remove messages parameters.');
    }
    try {
      return await this.messageService.removeMessages(
        removeMessagesDto.message_ids,
      );
    } catch (e) {
      this.logger.error(`Error removing messages: ${e.message}`);
      throw e;
    }
  }

  @Post('/get_all_message')
  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({ status: 200, description: 'Get messages successfully.' })
  @ApiBadRequestResponse({ description: 'Get messages failed.' })
  async getAllMessages() {
    try {
      return await this.messageService.getAllMessages();
    } catch (e) {
      this.logger.error(`Error getting all messages: ${e.message}`);
      throw e;
    }
  }
}
