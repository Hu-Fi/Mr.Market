import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../mixin/user/user.service';
import {
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';
import { getUserMe } from 'src/common/helpers/mixin/user';
import { MIXIN_OAUTH_URL } from 'src/common/constants/constants';

// Mock axios and getUserMe
jest.mock('axios');
jest.mock('src/common/helpers/mixin/user');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userService: UserService;

  beforeEach(async () => {
    // Mock UserService
    const mockUserService = {
      checkAndUpdateUserToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'admin.jwt_secret':
                  return 'jwt_secret';
                case 'admin.pass':
                  return 'admin_pass';
                case 'mixin.app_id':
                  return 'test_app_id';
                case 'mixin.oauth_secret':
                  return 'test_oauth_secret';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: UserService,
          useValue: mockUserService, // Use the mock service
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    console.log(configService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if password is not provided', async () => {
      await expect(authService.validateUser('')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      const password = 'wrong_password';
      const hashedAdminPassword = createHash('sha256')
        .update('admin_pass')
        .digest('hex');
      const hashIncomingPass = createHash('sha256')
        .update(password)
        .digest('hex');

      expect(hashedAdminPassword).not.toEqual(hashIncomingPass);
      await expect(authService.validateUser(password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a signed JWT if password is correct', async () => {
      const password = 'admin_pass';
      const hashedAdminPassword = createHash('sha256')
        .update(password)
        .digest('hex');
      const hashIncomingPass = createHash('sha256')
        .update(password)
        .digest('hex');

      expect(hashedAdminPassword).toEqual(hashIncomingPass);

      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('signed_token');
      const result = await authService.validateUser(password);

      expect(signSpy).toHaveBeenCalledWith(
        { username: 'admin' },
        { expiresIn: '120m' },
      );
      expect(result).toBe('signed_token');
    });
  });

  describe('mixinOauthHandler', () => {
    it('should throw HttpException if code length is not 64', async () => {
      const invalidCode = 'short_code';
      await expect(authService.mixinOauthHandler(invalidCode)).rejects.toThrow(
        HttpException,
      );
    });

    it('should make a POST request to Mixin OAuth URL and return access token', async () => {
      const validCode = 'a'.repeat(64);
      const mockResponse = {
        data: {
          data: { access_token: 'test_access_token' },
        },
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      (getUserMe as jest.Mock).mockResolvedValueOnce({ user_id: 'user_id' });

      const checkAndUpdateUserTokenSpy = jest
        .spyOn(userService, 'checkAndUpdateUserToken')
        .mockImplementation(() => Promise.resolve());

      const result = await authService.mixinOauthHandler(validCode);

      // Use the actual MIXIN_OAUTH_URL constant here
      expect(axios.post).toHaveBeenCalledWith(
        MIXIN_OAUTH_URL,
        {
          client_id: 'test_app_id',
          code: validCode,
          client_secret: 'test_oauth_secret',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      expect(getUserMe).toHaveBeenCalledWith('test_access_token');
      expect(checkAndUpdateUserTokenSpy).toHaveBeenCalledWith(
        { user_id: 'user_id' },
        'user_id',
        'test_access_token',
      );
      expect(result).toEqual({ token: 'test_access_token' });
    });

    it('should throw HttpException if Mixin OAuth request fails', async () => {
      const validCode = 'a'.repeat(64);
      (axios.post as jest.Mock).mockRejectedValueOnce({
        response: {
          data: { message: 'Request failed' },
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });

      await expect(authService.mixinOauthHandler(validCode)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
