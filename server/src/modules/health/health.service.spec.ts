import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { CustomLogger } from '../logger/logger.service';
import { getEntityManagerToken } from '@nestjs/typeorm';

const mockEntityManager = {
  // Mock methods as needed, for example:
  query: jest.fn().mockResolvedValue([]),
};

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    jest.clearAllMocks(); // Ensures clean state between tests

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        CustomLogger,
        {
          provide: getEntityManagerToken(), // This is how you get the correct token for EntityManager
          useValue: mockEntityManager, // Use the mock you defined above
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);

    ['bitfinex', 'mexc', 'binance'].forEach((exchangeName) => {
      const exchangeMock = service['exchanges'].get(exchangeName);
      if (exchangeMock) {
        exchangeMock.fetchBalance = jest.fn().mockResolvedValue({ total: 100 });
      }
    });
  });

  it('ping should return "pong"', async () => {
    await expect(service.ping()).resolves.toEqual('pong');
  });

  it('getExchangeHealth should return health status of a specific exchange', async () => {
    const healthStatus = await service.getExchangeHealth('binance');
    expect(healthStatus).toEqual({ statusCode: 200, message: 'alive' });
  });

  it('getExchangeHealth should throw BadRequestException if exchange not found', async () => {
    await expect(service.getExchangeHealth('unknown')).rejects.toThrow(
      'Exchange not found',
    );
  });

  it('getExchangeHealth should mark an exchange as dead if fetchBalance fails', async () => {
    const binanceMock = service['exchanges'].get('binance');
    binanceMock.fetchBalance = jest
      .fn()
      .mockRejectedValue(new Error('Exchange binance is dead'));

    await expect(service.getExchangeHealth('binance')).rejects.toThrow(
      'Exchange binance is dead',
    );
  });
});
