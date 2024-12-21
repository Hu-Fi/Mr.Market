/**
 * AuthService
 *
 * This service manages authentication processes including validation for admin user and
 * handling OAuth for normal mixin user. It relies on JWT for token generation and uses
 * environment variables for configuration.
 *
 * Dependencies:
 *  JwtService: NestJS service for working with JSON Web Tokens.
 *  ConfigService: Provides configuration values from environment variables.
 *  UserService: Handles userrelated operations.
 *  createHash: Node.js crypto module for creating hash digests.
 *  getUserMe: Helper function to fetch the authenticated user's information from Mixin.
 *
 * Constants:
 *  MIXIN_OAUTH_URL: The OAuth URL for Mixin authentication.
 *
 * Methods:
 *  constructor: Initializes the service with necessary configuration and validates critical secrets.
 *  validateUser(password: string): Validates the admin password and returns a signed JWT.
 *  mixinOauthHandler(code: string): Handles Mixin OAuth process, retrieves access token, and updates user information.
 *
 * Errors:
 *  Throws UnauthorizedException for missing or invalid password.
 *  Throws HttpException for invalid OAuth code length or HTTP request failures.
 *
 * Notes:
 *  The service ensures secure handling of JWT secrets and admin passwords.
 *  It performs user validation by comparing hashed passwords.
 */

import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MIXIN_OAUTH_URL } from 'src/common/constants/constants';
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getUserMe } from 'src/common/helpers/mixin/user';
import { UserService } from '../mixin/user/user.service';
import { CustomLogger } from '../logger/logger.service';
import { MessageService } from '../mixin/message/message.service';

@Injectable()
export class AuthService {
  private secret: string;
  private adminPassword: string;
  private adminTokenDuration: string = '2h';
  private readonly logger = new CustomLogger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private mixinMessageService: MessageService,
  ) {
    this.secret = this.configService.get<string>('admin.jwt_secret');
    this.adminPassword = this.configService.get<string>('admin.pass');

    if (!this.secret) {
      throw new Error(
        'AuthService initialization failed: JWT secret not found in environment variables',
      );
    }
    if (!this.adminPassword) {
      throw new Error(
        'AuthService initialization failed: Admin password not found in environment variables',
      );
    }
  }

  /**
   * Validates the admin password and returns a signed JWT token.
   * @param password - The password to validate.
   * @returns A signed JWT token.
   * @throws UnauthorizedException - If the password is invalid or missing.
   */
  async validateUser(password: string): Promise<string> {
    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    const hashedAdminPassword = createHash('sha256')
      .update(this.adminPassword)
      .digest('hex');
    if (hashedAdminPassword !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { username: 'admin' };
    return this.jwtService.sign(payload, {
      expiresIn: this.adminTokenDuration,
    });
  }

  /**
   * Handles the Mixin OAuth process, retrieves the access token, and updates the user information.
   * @param code - The OAuth code.
   * @returns The access token.
   * @throws HttpException - If the code length is invalid or an HTTP request fails.
   */
  async mixinOauthHandler(code: string) {
    if (code.length !== 64) {
      throw new HttpException('Invalid code length', HttpStatus.BAD_REQUEST);
    }

    const body = {
      client_id: this.configService.get<string>('mixin.app_id'),
      code: code,
      client_secret: this.configService.get<string>('mixin.oauth_secret'),
    };

    try {
      const response = await axios.post(MIXIN_OAUTH_URL, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const accessToken = response.data.data.access_token;
      const userResp = await getUserMe(accessToken);

      this.logger.debug(
        `await getUserMe user: ${JSON.stringify(userResp.data)}`,
      );
      const user = userResp.data;
      if (user) {
        await this.userService.checkAndUpdateUserToken(
          user,
          user.user_id,
          accessToken,
        );
        await this.mixinMessageService.sendTextMessage(
          user.user_id,
          '🎉 You have signed in to Mr.Market successfully!',
        );
      }
      return { token: accessToken };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch Mixin OAuth token',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
