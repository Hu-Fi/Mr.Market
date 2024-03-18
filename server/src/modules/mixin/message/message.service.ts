import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MixinApi, Keystore, KeystoreClientReturnType } from "@mixin.dev/mixin-node-sdk";
import { CustomLogger } from "src/modules/logger/logger.service";
import { MessageRepository } from "./message.repository";
import { MixinMessage } from 'src/common/entities/mixin-message.eneity';

@Injectable()
export class MessageService {
  private keystore: Keystore;
  private client: KeystoreClientReturnType;
  private readonly logger = new CustomLogger(MessageService.name);

  constructor(
    private configService: ConfigService,
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

  async addMessageHistory(message: MixinMessage) {
    try {
      const newMessage = await this.messageRepository.addMessageHistory(message);
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
      this.logger.error(`Failed to remove message with ID ${message_id}`, error);
      throw error;
    }
  }

  async getAllMessages(): Promise<MixinMessage[]> {
    try {
      return await this.messageRepository.getAllMessages();
    } catch (error) {
      this.logger.error('Failed to get all messages', error);
      throw error;
    }
  }
}
