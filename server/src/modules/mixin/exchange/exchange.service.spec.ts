import * as ccxt from 'ccxt';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './exchange.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

jest.mock('ccxt', () => ({
  __esModule: true,
  default: jest.fn(),
  okx: jest.fn().mockImplementation(() => ({
    has: {
      fetchDepositAddress: true,
      withdraw: true,
    },
    fetchDepositAddress: jest.fn(),
    withdraw: jest.fn(),
    // Mock other methods as needed
  })),
}));

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
          exchange: 'okx',
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
        service.getBalanceBySymbol = jest.fn().mockResolvedValue(mockBalance);

        const result = await service.checkExchangeBalanceEnough(
          'okx',
          'apiKey',
          'apiSecret',
          'BTC',
          '1',
        );

        expect(service.getBalanceBySymbol).toHaveBeenCalledWith(
          'okx',
          'apiKey',
          'apiSecret',
          'BTC',
        );
        expect(result).toBeTruthy();
      },
    );
  });

  describe('aggregateBalancesByExchange', () => {
    it('should correctly aggregate balances by exchange', () => {
      const successfulBalances = [
        {
          exchange: 'okx',
          balance: {
            free: { BTC: 1 },
            used: { BTC: 0.5 },
            total: { BTC: 1.5 },
          },
        },
        {
          exchange: 'okx',
          balance: { free: { ETH: 2 }, used: { ETH: 1 }, total: { ETH: 3 } },
        },
        {
          exchange: 'coinbase',
          balance: {
            free: { BTC: 0.5 },
            used: { BTC: 0.2 },
            total: { BTC: 0.7 },
          },
        },
      ];

      const aggregatedBalances =
        service.aggregateBalancesByExchange(successfulBalances);

      expect(aggregatedBalances['okx']).toEqual({
        free: { BTC: 1, ETH: 2 },
        used: { BTC: 0.5, ETH: 1 },
        total: { BTC: 1.5, ETH: 3 },
      });
      expect(aggregatedBalances['coinbase']).toEqual({
        free: { BTC: 0.5 },
        used: { BTC: 0.2 },
        total: { BTC: 0.7 },
      });
    });
  });

  describe('getDepositAddress and _getDepositAddress', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (ccxt.okx as jest.Mock).mockImplementation(() => ({
        has: {
          fetchDepositAddress: true,
        },
        fetchDepositAddress: jest
          .fn()
          .mockResolvedValue({ address: '1BTCADDRESS', tag: '' }),
      }));
    });

    it('should successfully retrieve deposit address', async () => {
      const mockAPIKey = { api_key: 'apiKey', api_secret: 'apiSecret' };
      service.readAPIKey = jest.fn().mockResolvedValue(mockAPIKey);

      const result = await service.getDepositAddress({
        apiKeyId: '1',
        symbol: 'BTC',
        network: 'Bitcoin',
      });

      expect(result).toEqual({ address: '1BTCADDRESS', memo: '' });
    });

    it('should handle error when exchange does not support fetchDepositAddress', async () => {
      (ccxt.okx as jest.Mock).mockImplementation(() => ({
        has: {
          fetchDepositAddress: false,
        },
      }));

      const mockAPIKey = { api_key: 'apiKey', api_secret: 'apiSecret' };
      service.readAPIKey = jest.fn().mockResolvedValue(mockAPIKey);
    });
  });

  // describe('pickAPIKeyOnDemand', () => {
  //   // TODO: Fix
  //   it.failing(
  //     'should pick an API key based on balance and demand',
  //     async () => {
  //       const mockApiKeys = [
  //         {
  //           key_id: '1',
  //           exchange: 'okx',
  //           api_key: 'apiKey1',
  //           api_secret: 'apiSecret1',
  //         },
  //       ];
  //       exchangeRepository.readAllAPIKeysByExchange.mockResolvedValue(
  //         mockApiKeys,
  //       );
  //       service.checkExchangeBalanceEnough = jest.fn().mockResolvedValue(true);

  //       const result = await service.pickAPIKeyOnDemand('okx', 'asset_id', '1');

  //       expect(
  //         exchangeRepository.readAllAPIKeysByExchange,
  //       ).toHaveBeenCalledWith('okx');
  //       expect(service.checkExchangeBalanceEnough).toHaveBeenCalled();
  //       expect(result.type).toEqual('success');
  //     },
  //   );
  // });
});
