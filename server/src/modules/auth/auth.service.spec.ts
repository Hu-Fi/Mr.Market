// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

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
    process.env.ADMIN_PASSWORD = 'correctpassword';
    await expect(service.validateUser('incorrectpassword')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should generate a JWT if password is correct', async () => {
    process.env.ADMIN_PASSWORD = 'correctpassword';
    const result = await service.validateUser('correctpassword');
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin' });
    expect(result).toBe('mock-jwt');
  });
});
