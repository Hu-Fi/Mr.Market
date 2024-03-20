import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  // let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-jwt'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'admin.jwt_secret') return 'mock-jwt-secret';
              if (key === 'admin.pass') return 'correctpassword';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if password is not provided', async () => {
    await expect(service.validateUser(null)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if password is incorrect', async () => {
    await expect(service.validateUser('incorrectpassword')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should generate a JWT if password is correct', async () => {
    const result = await service.validateUser('correctpassword');
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin' });
    expect(result).toBe('mock-jwt');
  });
});
