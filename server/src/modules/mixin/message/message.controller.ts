import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import { CustomLogger } from "src/modules/logger/logger.service";
import { BroadcastMessageDto, PrivateMessageDto } from "./message.dto";
import { MessageService } from "./message.service";

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
      await this.messageService.broadcastTextMessage(broadcastMessageDto.message);
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
      await this.messageService.sendTextMessage(privateMessageDto.user_id, privateMessageDto.message);
    } catch (e) {
      this.logger.error(`Error sending priavet message: ${e.message}`);
      throw e;
    }
  }
}