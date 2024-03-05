import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';

jest.mock('ccxt', () => ({
  pro: {
    binance: jest.fn().mockImplementation(() => ({
      createOrder: jest.fn(),
      cancelOrder: jest.fn().mockResolvedValue,
    })),
    bitfinex: jest.fn().mockImplementation(() => ({})),
    mexc: jest.fn().mockImplementation(() => ({})),
  },
}));

describe('TradeService', () => {
  let service: TradeService;
  let mockTradeRepository;

  beforeEach(async () => {
    mockTradeRepository = {
      createTrade: jest.fn(),
      updateTradeStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        {
          provide: TradeRepository,
          useValue: mockTradeRepository,
        },
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);

    // Mock initialization of exchanges to ensure the service can find the mocked exchanges
    service['exchanges'].set('binance', new ccxt.pro.binance());
  });

  describe('executeLimitTrade', () => {
    it('should execute a limit trade successfully', async () => {
      const limitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USD',
        side: 'sell',
        amount: 1,
        price: 50000,
      };

      const mockOrder = {
        id: 'order123',
        status: 'closed',
        price: 50000,
      };

      service['exchanges'].get('binance').createOrder = jest
        .fn()
        .mockResolvedValue(mockOrder);

      await service.executeLimitTrade(limitTradeDto);

      expect(
        service['exchanges'].get('binance').createOrder,
      ).toHaveBeenCalledWith('BTC/USD', 'limit', 'sell', 1, 50000);
      expect(mockTradeRepository.createTrade).toHaveBeenCalledWith({
        userId: 'user123',
        clientId: 'client123',
        symbol: 'BTC/USD',
        side: 'sell',
        type: 'limit',
        amount: 1,
        price: 50000,
        status: 'closed',
        orderId: 'order123',
      });
    });
    it('should throw BadRequestException for missing parameters', async () => {
      const limitTradeDto = {
        // Assuming one or more required fields are missing
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        // Missing symbol, side, amount, or price
      };

      await expect(
        service.executeLimitTrade(limitTradeDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for unconfigured exchange', async () => {
      const limitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'nonExistentExchange',
        symbol: 'BTC/USD',
        side: 'sell',
        amount: 1,
        price: 50000,
      };

      await expect(service.executeLimitTrade(limitTradeDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException on createOrder failure', async () => {
      const limitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USD',
        side: 'sell',
        amount: 1,
        price: 50000,
      };

      ccxt.pro.binance.prototype.createOrder = jest
        .fn()
        .mockRejectedValue(new Error('API Error'));

      await expect(service.executeLimitTrade(limitTradeDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('executeMarketTrade', () => {
    it('should execute a market trade successfully', async () => {
      const marketTradeDto = {
        userId: '1',
        clientId: '1',
        exchange: 'binance',
        symbol: 'BTC/USD',
        side: 'buy',
        amount: 1,
      };

      const mockOrderResponse = {
        id: 'order123',
        status: 'closed',
        price: 50000,
      };

      service['exchanges'].get('binance').createOrder = jest
        .fn()
        .mockResolvedValue(mockOrderResponse);

      await service.executeMarketTrade(marketTradeDto);

      expect(
        service['exchanges'].get('binance').createOrder,
      ).toHaveBeenCalledWith('BTC/USD', 'market', 'buy', 1);
      expect(mockTradeRepository.createTrade).toHaveBeenCalledWith({
        userId: '1',
        clientId: '1',
        symbol: 'BTC/USD',
        side: 'buy',
        type: 'market',
        amount: 1,
        status: 'closed',
        price: 50000,
        orderId: 'order123',
      });
    });
  });

  // Other tests...
});
