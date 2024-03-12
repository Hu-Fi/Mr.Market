// jwt.strategy.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  // let configService: ConfigService;
  const mockJwtSecret = 'mock_jwt_secret';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              admin: {
                jwt_secret: mockJwtSecret,
              },
            }),
          ],
        }),
      ],
      providers: [
        {
          provide: JwtStrategy,
          useFactory: (configService: ConfigService) => {
            return new JwtStrategy(configService);
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    // configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate the payload and return user data', async () => {
    const payload = { username: 'admin', sub: 'user-id' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 'user-id', username: 'admin' });
  });

  // it('should use the mocked JWT secret', () => {
  //   const jwtSecret = configService.get<string>('admin.jwt_secret');
  //   expect(jwtSecret).toBe(mockJwtSecret);
  //   expect(strategy['secretOrKey']).toBe(mockJwtSecret);
  // });
});
