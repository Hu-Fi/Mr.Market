/**
 * UserService
 *
 * This service handles all user-related operations, including adding, removing,
 * and updating user information. It interacts with the UserRepository for data
 * persistence and utilizes the Mixin API for additional functionalities.
 *
 * Dependencies:
 * - ConfigService: Provides configuration values from environment variables.
 * - UserRepository: Handles data operations related to users.
 * - CustomLogger: Custom logging service for recording errors and other log information.
 * - MixinApi: Mixin Node SDK for interacting with the Mixin network.
 * - mapApiResponseToMixinUser: Helper function to map Mixin API response to a MixinUser entity.
 *
 * Methods:
 * - addUser(user: Partial<MixinUser>): Adds a new user to the repository.
 *
 * - removeUserById(user_id: string): Removes a user from the repository by their ID.
 *
 * - checkUserExist(user_id: string): Checks if a user exists in the repository by their ID.
 *
 * - addUserIfNotExist(user: Partial<MixinUser>, user_id: string): Adds a new user if they do not already exist.
 *
 * - getAllUsers(): Retrieves all users from the repository.
 *
 * - updateUserToken(user_id: string, jwt_token: string): Updates the JWT token of a user.
 *
 * - checkAndUpdateUserToken(user: Partial<MixinUser>, user_id: string, jwt_token: string):
 *   Checks if a user exists and updates their token, or adds them if they do not exist.
 *
 * Note: This service uses a keystore for Mixin API authentication and handles various
 * potential errors, logging them appropriately.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import {
  MixinApi,
  Keystore,
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';

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
      },
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

  async checkUserExist(user_id: string) {
    try {
      return await this.userRepository.checkUserExist(user_id);
    } catch (error) {
      this.logger.error(`Failed to check user existence ${user_id}`, error);
      return false;
    }
  }

  async addUserIfNotExist(user: MixinUser, user_id: string) {
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
      this.logger.error('Failed to get all users', error);
      throw error;
    }
  }
}
