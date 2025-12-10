import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import {
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';
import { mapApiResponseToMixinUser } from 'src/common/helpers/mixin/user';
import { MixinClientService } from '../client/mixin-client.service';

@Injectable()
export class UserService {
  private client: KeystoreClientReturnType;
  private readonly logger = new CustomLogger(UserService.name);

  constructor(
    private userRepository: UserRepository,
    private mixinClientService: MixinClientService,
  ) {
    this.client = this.mixinClientService.client;
  }

  async addUser(user: Partial<MixinUser>) {
    try {
      const newUser = await this.userRepository.addUser(user);
      return newUser;
    } catch (error) {
      this.logger.error('Failed to add user', error.message);
      throw error;
    }
  }

  async removeUserById(user_id: string) {
    try {
      await this.userRepository.removeUserById(user_id);
    } catch (error) {
      this.logger.error(
        `Failed to remove user with ID ${user_id}`,
        error.message,
      );
      throw error;
    }
  }

  async checkUserExist(user_id: string) {
    try {
      return await this.userRepository.checkUserExist(user_id);
    } catch (error) {
      this.logger.error(
        `Failed to check user existence ${user_id}`,
        error.message,
      );
      return false;
    }
  }

  async addUserIfNotExist(user: Partial<MixinUser>, user_id: string) {
    const exist = await this.checkUserExist(user_id);
    if (!exist) {
      await this.addUser(user);
    }
    return exist;
  }

  async getAllUsers(): Promise<MixinUser[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      this.logger.error('Failed to get all users', error.message);
      throw error;
    }
  }

  async updateUserToken(user_id: string, jwt_token: string): Promise<void> {
    try {
      await this.userRepository.updateUser(user_id, { jwt_token });
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID ${user_id}`,
        error.message,
      );
      throw error;
    }
  }

  async checkAndUpdateUserToken(
    user: Partial<MixinUser>,
    user_id: string,
    jwt_token: string,
  ): Promise<void> {
    const mappedUser = mapApiResponseToMixinUser(user, jwt_token);
    try {
      const userExists = await this.checkUserExist(user_id);
      if (userExists) {
        await this.updateUserToken(user_id, jwt_token);
      } else {
        await this.addUser(mappedUser);
      }
    } catch (error) {
      this.logger.error(
        `Failed to check and update user with ID ${user_id}`,
        error.message,
      );
      throw error;
    }
  }
}
