import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageRepository } from './message.repository';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { UserService } from 'src/modules/mixin/user/user.service';
import { MixinMessage } from 'src/common/entities/mixin-message.entity';
import {
  MixinApi,
  Keystore,
  KeystoreClientReturnType,
  UserResponse,
} from '@mixin.dev/mixin-node-sdk';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';

@Injectable()
export class MessageService implements OnModuleInit {
  private keystore: Keystore;
  private client: KeystoreClientReturnType;
  private readonly logger = new CustomLogger(MessageService.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private messageRepository: MessageRepository,
  ) {
    this.keystore = {
      app_id: this.configService.get<string>('mixin.app_id'),
      session_id: this.configService.get<string>('mixin.session_id'),
      server_public_key: this.configService.get<string>(
        'mixin.server_public_key',
      ),
      session_private_key: this.configService.get<string>(
        'mixin.session_private_key',
      ),
    };
    this.client = MixinApi({
      keystore: this.keystore,
    });
  }

  async onModuleInit() {
    this.client.blaze.loop(this.messageHandler);
    this.logger.log('Start handling mixin messages');
  }

  async addMessageHistory(message: MixinMessage) {
    try {
      const newMessage = await this.messageRepository.addMessageHistory(
        message,
      );
      return newMessage;
    } catch (error) {
      this.logger.error('Failed to add message history', error);
      throw error;
    }
  }

  async removeMessageById(message_id: string) {
    try {
      await this.messageRepository.removeMessageById(message_id);
    } catch (error) {
      this.logger.error(
        `Failed to remove message with ID ${message_id}`,
        error,
      );
      throw error;
    }
  }

  async removeMessages(message_ids: string[]) {
    message_ids.forEach(async (id) => {
      try {
        await this.messageRepository.removeMessageById(id);
      } catch (error) {
        this.logger.error(`Failed to remove message with ID ${id}`, error);
        throw error;
      }
    });
  }

  async checkMessageExist(message_id: string) {
    try {
      return await this.messageRepository.checkMessageExist(message_id);
    } catch (error) {
      this.logger.error(
        `Failed to check message existence ${message_id}`,
        error,
      );
      return false;
    }
  }

  async addMessageIfNotExist(msg: MixinMessage, message_id: string) {
    const exist = await this.checkMessageExist(message_id);
    if (!exist) {
      await this.addMessageHistory(msg);
    }
    return exist;
  }

  async getAllMessages(): Promise<MixinMessage[]> {
    try {
      return await this.messageRepository.getAllMessages();
    } catch (error) {
      this.logger.error('Failed to get all messages', error);
      throw error;
    }
  }

  // Add a controller endpoint for this
  async sendTextMessage(user_id: string, message: string) {
    return await this.client.message.sendText(user_id, message);
  }

  // Add a controller endpoint for this
  async broadcastTextMessage(message: string) {
    const users = await this.userService.getAllUsers();
    users.forEach(async (u) => {
      await this.sendTextMessage(u.user_id, message);
    });
  }

  messageHandler = {
    onMessage: async (msg) => {
      // Filter only user message
      if (msg.source != 'CREATE_MESSAGE') {
        return;
      }

      this.logger.log(
        `Mixin Message: ${Buffer.from(msg.data, 'base64').toString('utf-8')}`,
      );

      if (!msg.user_id) {
        return;
      }

      // Add user record if not exist in db
      let user: UserResponse;
      const exist = this.userService.checkUserExist(msg.user_id);
      if (!exist) {
        user = await this.client.user.fetch(msg.user_id);
        this.userService.addUserIfNotExist(
          { ...user, last_updated: getRFC3339Timestamp() },
          msg.user_id,
        );
      }

      // Add message record if not exist in db
      const processed = this.addMessageIfNotExist({ ...msg }, msg.message_id);
      if (!processed) {
        this.logger.log(`message ${msg.message_id} was not processed`);
        return;
      }

      // Handle custom messages
    },
    // callback when group information update, which your bot is in
    onConversation: async (msg) => {
      const group = await this.client.conversation.fetch(msg.conversation_id);
      console.log(`group ${group.name} information updated`);
    },
  };
}
