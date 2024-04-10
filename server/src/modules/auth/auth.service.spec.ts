import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StrategyUserRepository } from '../strategy/strategy-user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

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
              switch (key) {
                case 'admin.jwt_secret':
                  return 'mock-jwt-secret';
                case 'admin.pass':
                  return 'correctpassword';
                default:
                  throw new Error(`Unhandled key: ${key}`);
              }
            }),
          },
        },
        {
          provide: StrategyUserRepository,
          useValue: {
            findArbitrageByUserId: jest.fn().mockResolvedValue([]),
            findMarketMakingByUserId: jest.fn().mockResolvedValue([]),
            // Mock the `checkSnapshotExist` method here:
            checkSnapshotExist: jest.fn().mockResolvedValue(false),
            // Add other methods as necessary
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
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
