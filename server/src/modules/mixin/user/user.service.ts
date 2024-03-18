import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MixinApi, Keystore, KeystoreClientReturnType } from "@mixin.dev/mixin-node-sdk";
import { CustomLogger } from "src/modules/logger/logger.service";
import { UserRepository } from "./user.repository";
import { MixinUser } from "src/common/entities/mixin-user.entity";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class UserService {
  private keystore: Keystore;
  private client: KeystoreClientReturnType;
  private readonly logger = new CustomLogger(UserService.name);

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
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
      blazeOptions: {
        parse: true,
        syncAck: true,
      }
    });
  }

  async addUser(user: MixinUser) {
    try {
      const newUser = await this.userRepository.addUser(user);
      return newUser;
    } catch (error) {
      this.logger.error('Failed to add user', error);
      throw error;
    }
  }

  async removeUserById(user_id: string) {
    try {
      await this.userRepository.removeUserById(user_id);
    } catch (error) {
      this.logger.error(`Failed to remove user with ID ${user_id}`, error);
      throw error;
    }
  }

  async getAllUsers(): Promise<MixinUser[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      this.logger.error('Failed to get all users', error);
      throw error;
    }
  }

  // Add a controller endpoint for this
  async sendTextMessage(user_id: string, message: string) {
    return await this.client.message.sendText(user_id, message)
  }

  // Add a controller endpoint for this
  async broadcastTextMessage(message: string) {
    const users = await this.getAllUsers()
    users.forEach(async u => {
      await this.sendTextMessage(u.user_id, message)
    })
  }

  messageHandler = {
    // callback when bot receive message
    onMessage: async msg => {
      // Check user existence
      // Add user if user doesn't exist in db
      // Update last updated
      const user = await this.client.user.fetch(msg.user_id);
      console.log(`${user.full_name} send you a ${msg.category} message: ${msg.data}`);

      // make your bot automatically reply
      const res = await this.client.message.sendText(msg.user_id, 'received');
      console.log(`message ${res.message_id} is sent`);
    },
    // callback when group information update, which your bot is in
    onConversation: async msg => {
      const group = await this.client.conversation.fetch(msg.conversation_id);
      console.log(`group ${group.name} information updated`);
    },
  };

  @Cron('')
  async HandleMessage() {
    this.client.blaze.loop(this.messageHandler);
  }
}
