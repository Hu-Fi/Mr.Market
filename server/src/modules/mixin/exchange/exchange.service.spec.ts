import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './exchange.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

jest.mock('ccxt');

const mockExchangeRepository = () => ({
  readAllAPIKeys: jest.fn(),
  readAllAPIKeysByExchange: jest.fn(),
});

const mockEventEmitter2 = () => ({
  emit: jest.fn(),
});

describe('ExchangeService', () => {
  let service: ExchangeService;
  let exchangeRepository;
  let eventEmitter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: ExchangeRepository, useFactory: mockExchangeRepository },
        { provide: EventEmitter2, useFactory: mockEventEmitter2 },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    exchangeRepository = module.get<ExchangeRepository>(ExchangeRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(exchangeRepository).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('loadAPIKeys', () => {
    it('should load API keys and initialize exchange instances', async () => {
      const mockApiKeys = [
        {
          key_id: '1',
          exchange: 'binance',
          api_key: 'api_key_1',
          api_secret: 'api_secret_1',
        },
      ];
      exchangeRepository.readAllAPIKeys.mockResolvedValue(mockApiKeys);

      exchangeRepository.readAllAPIKeys();

      expect(exchangeRepository.readAllAPIKeys).toHaveBeenCalled();
    });
  });

  describe('checkExchangeBalanceEnough', () => {
    it.failing(
      'should check if exchange balance is enough for a given amount',
      async () => {
        // TODO: adapt CCXT fetch balance
        const mockBalance = { total: { BTC: 2 } };
        service.getBalance = jest.fn().mockResolvedValue(mockBalance);

        const result = await service.checkExchangeBalanceEnough(
          'binance',
          'apiKey',
          'apiSecret',
          'BTC',
          '1',
        );

        expect(service.getBalance).toHaveBeenCalledWith(
          'binance',
          'apiKey',
          'apiSecret',
          'BTC',
        );
        expect(result).toBeTruthy();
      },
    );
  });

  describe('pickAPIKeyOnDemand', () => {
    // TODO: Fix
    it.failing(
      'should pick an API key based on balance and demand',
      async () => {
        const mockApiKeys = [
          {
            key_id: '1',
            exchange: 'binance',
            api_key: 'apiKey1',
            api_secret: 'apiSecret1',
          },
        ];
        exchangeRepository.readAllAPIKeysByExchange.mockResolvedValue(
          mockApiKeys,
        );
        service.checkExchangeBalanceEnough = jest.fn().mockResolvedValue(true);

        const result = await service.pickAPIKeyOnDemand(
          'binance',
          'asset_id',
          '1',
        );

        expect(
          exchangeRepository.readAllAPIKeysByExchange,
        ).toHaveBeenCalledWith('binance');
        expect(service.checkExchangeBalanceEnough).toHaveBeenCalled();
        expect(result.type).toEqual('success');
      },
    );
  });
});
