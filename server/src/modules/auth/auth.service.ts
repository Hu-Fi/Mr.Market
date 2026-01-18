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
  Logger,
} from '@nestjs/common';
import { getUserMe } from 'src/common/helpers/mixin/user';
import { UserService } from '../mixin/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private secret: string;
  private adminPassword: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
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

    const mixinOauthSecret = this.configService.get<string>('mixin.oauth_secret');
    if (!mixinOauthSecret) {
      this.logger.warn(
        'MIXIN_OAUTH_SECRET is not defined in .env. Mixin login will fail.',
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
    return this.jwtService.sign(payload, { expiresIn: '120m' });
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

      const user = await getUserMe(accessToken);
      if (user) {
        await this.userService.checkAndUpdateUserToken(
          user,
          user.user_id,
          accessToken,
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
