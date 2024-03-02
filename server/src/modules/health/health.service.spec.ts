import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return pong', async () => {
    expect(await service.ping()).toBe('pong');
  });

  // We need a test api key to run this test if we want to
  it.skip('should return a health map', async () => {
    expect(Object.values(await service.getAllHealth()).length).not.toBe(0);
  });

  // We need a test api key to run this test if we want to
  it.skip('should be alive', async () => {
    expect(await service.getExchangeHealth('binance')).toBeDefined();
  });
});
