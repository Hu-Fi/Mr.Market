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
        switch (exchangeMock.id) {
          case 'binance':
            exchangeMock.fetchBalance = jest
              .fn()
              .mockResolvedValue({ total: 100 });
            break;
          case 'mexc':
            exchangeMock.fetchBalance = jest.fn().mockResolvedValue(undefined);
            break;
          case 'bitfinex':
            exchangeMock.fetchBalance = jest
              .fn()
              .mockRejectedValue(new Error('Exchange bitfinex is dead'));
        }
      }
    });
  });
  describe('getAllHealth', () => {
    it('should throw error and not handle any additional exchange if any exchange fetch fail', async () => {
      await expect(service.getAllHealth()).rejects.toThrow(
        'Exchange bitfinex is dead',
      );
    });
    it('should handle both alive and dead exchanges fetch', async () => {
      const bitfinexMock = service['exchanges'].get('bitfinex');
      bitfinexMock.fetchBalance = jest.fn().mockResolvedValue({ total: 100 });
      const allExchangesHealthResult = await service.getAllHealth();
      expect(allExchangesHealthResult).toEqual([
        { Bitfinex: 'alive' },
        { 'MEXC Global': 'dead' },
        { Binance: 'alive' },
      ]);
    });
  });
  describe('getExchangeHealth', () => {
    it('should return health status of a specific exchange', async () => {
      const healthStatus = await service.getExchangeHealth('binance');
      expect(healthStatus).toEqual({ statusCode: 200, message: 'alive' });
    });

    it('should throw BadRequestException if exchange not found', async () => {
      await expect(service.getExchangeHealth('unknown')).rejects.toThrow(
        'Exchange not found',
      );
    });

    it('should mark an exchange as dead if fetchBalance fails', async () => {
      await expect(service.getExchangeHealth('bitfinex')).rejects.toThrow(
        'Exchange bitfinex is dead',
      );
    });
  });

  it('ping should return "pong"', async () => {
    await expect(service.ping()).resolves.toEqual('pong');
  });
});
