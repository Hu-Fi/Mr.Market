import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../mixin/user/user.service';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';
import { getUserMe } from 'src/common/helpers/mixin/user';

jest.mock('axios');
jest.mock('src/common/helpers/mixin/user');

describe('AuthService', () => {
  let authService: AuthService;
  // let jwtService: JwtService;
  // let configService: ConfigService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'admin.jwt_secret') return 'test-secret';
              if (key === 'admin.pass') return 'admin-pass';
              if (key === 'mixin.app_id') return 'test-app-id';
              if (key === 'mixin.oauth_secret') return 'test-oauth-secret';
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            checkAndUpdateUserToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // jwtService = module.get<JwtService>(JwtService);
    // configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if no password is provided', async () => {
      await expect(authService.validateUser(null)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const password = createHash('sha256').update('wrong-pass').digest('hex');
      await expect(authService.validateUser(password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return signed JWT token if password is valid', async () => {
      const password = createHash('sha256').update('admin-pass').digest('hex');
      const token = await authService.validateUser(password);
      expect(token).toBe('signed-token');
    });
  });

  describe('mixinOauthHandler', () => {
    it('should throw HttpException if code length is invalid', async () => {
      await expect(authService.mixinOauthHandler('short-code')).rejects.toThrow(
        HttpException,
      );
    });

    it('should return access token on successful OAuth', async () => {
      const mockResponse = {
        data: {
          data: {
            access_token: 'mock-access-token',
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
      (getUserMe as jest.Mock).mockResolvedValue({
        user_id: 'test-user-id',
      });

      const result = await authService.mixinOauthHandler('a'.repeat(64));
      expect(result.token).toBe('mock-access-token');
      expect(userService.checkAndUpdateUserToken).toHaveBeenCalledWith(
        { user_id: 'test-user-id' },
        'test-user-id',
        'mock-access-token',
      );
    });

    it('should throw HttpException on failed OAuth', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('OAuth failed'));

      await expect(
        authService.mixinOauthHandler('a'.repeat(64)),
      ).rejects.toThrow(HttpException);
    });
  });
});
