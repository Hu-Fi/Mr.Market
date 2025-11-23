import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { CustomLogger } from '../../infrastructure/logger/logger.service';
import { ExchangeInitService } from 'src/modules/infrastructure/exchange-init/exchange-init.service';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';

jest.mock('ccxt');

describe('TradeService', () => {
  let service: TradeService;
  let tradeRepository: TradeRepository;
  let exchangeInitService: ExchangeInitService;
  let exchangeMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        {
          provide: TradeRepository,
          useValue: {
            createTrade: jest.fn(),
            updateTradeStatus: jest.fn(),
          },
        },
        {
          provide: ExchangeInitService,
          useValue: {
            getExchange: jest.fn(),
          },
        },
        CustomLogger,
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
    tradeRepository = module.get<TradeRepository>(TradeRepository);
    exchangeInitService = module.get<ExchangeInitService>(ExchangeInitService);
    exchangeMock = new ccxt.binance();
  });

  describe('executeMarketTrade', () => {
    it('should execute a market trade successfully', async () => {
      const marketTradeDto: MarketTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        side: 'buy',
        amount: 1,
      };

      const orderMock = {
        id: 'order123',
        status: 'closed',
        price: 30000,
      };

      exchangeInitService.getExchange = jest.fn().mockReturnValue(exchangeMock);
      exchangeMock.createOrder = jest.fn().mockResolvedValue(orderMock);

      await service.executeMarketTrade(marketTradeDto);

      expect(exchangeInitService.getExchange).toHaveBeenCalledWith('binance');
      expect(exchangeMock.createOrder).toHaveBeenCalledWith(
        'BTC/USDT',
        'market',
        'buy',
        1,
      );
      expect(tradeRepository.createTrade).toHaveBeenCalledWith({
        userId: 'user123',
        clientId: 'client123',
        symbol: 'BTC/USDT',
        type: 'market',
        side: 'buy',
        amount: 1,
        status: 'closed',
        price: 30000,
        orderId: 'order123',
      });
    });

    it('should throw BadRequestException if required parameters are missing', async () => {
      const marketTradeDto: MarketTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: '',
        side: 'buy',
        amount: 1,
      };

      await expect(service.executeMarketTrade(marketTradeDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if trade execution fails', async () => {
      const marketTradeDto: MarketTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        side: 'buy',
        amount: 1,
      };

      exchangeInitService.getExchange = jest.fn().mockReturnValue(exchangeMock);
      exchangeMock.createOrder = jest
        .fn()
        .mockRejectedValue(new Error('Trade failed'));

      await expect(service.executeMarketTrade(marketTradeDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('executeLimitTrade', () => {
    it('should execute a limit trade successfully', async () => {
      const limitTradeDto: LimitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        side: 'buy',
        amount: 1,
        price: 30000,
      };

      const orderMock = {
        id: 'order123',
        status: 'open',
        price: 30000,
      };

      exchangeInitService.getExchange = jest.fn().mockReturnValue(exchangeMock);
      exchangeMock.createOrder = jest.fn().mockResolvedValue(orderMock);

      await service.executeLimitTrade(limitTradeDto);

      expect(exchangeInitService.getExchange).toHaveBeenCalledWith('binance');
      expect(exchangeMock.createOrder).toHaveBeenCalledWith(
        'BTC/USDT',
        'limit',
        'buy',
        1,
        30000,
      );
      expect(tradeRepository.createTrade).toHaveBeenCalledWith({
        userId: 'user123',
        clientId: 'client123',
        symbol: 'BTC/USDT',
        side: 'buy',
        type: 'limit',
        amount: 1,
        price: 30000,
        status: 'open',
        orderId: 'order123',
      });
    });

    it('should throw BadRequestException if required parameters are missing', async () => {
      const limitTradeDto: LimitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        side: 'buy',
        amount: 1,
        price: null,
      };

      await expect(service.executeLimitTrade(limitTradeDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if trade execution fails', async () => {
      const limitTradeDto: LimitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        side: 'buy',
        amount: 1,
        price: 30000,
      };

      exchangeInitService.getExchange = jest.fn().mockReturnValue(exchangeMock);
      exchangeMock.createOrder = jest
        .fn()
        .mockRejectedValue(new Error('Trade failed'));

      await expect(service.executeLimitTrade(limitTradeDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order successfully', async () => {
      const orderId = 'order123';
      const symbol = 'BTC/USDT';

      exchangeMock.cancelOrder = jest.fn().mockResolvedValue({});

      service['exchange'] = exchangeMock;

      await service.cancelOrder(orderId, symbol);

      expect(exchangeMock.cancelOrder).toHaveBeenCalledWith(orderId, symbol);
      expect(tradeRepository.updateTradeStatus).toHaveBeenCalledWith(
        orderId,
        'cancelled',
      );
    });

    it('should throw InternalServerErrorException if order cancellation fails', async () => {
      const orderId = 'order123';
      const symbol = 'BTC/USDT';

      exchangeMock.cancelOrder = jest
        .fn()
        .mockRejectedValue(new Error('Cancellation failed'));

      service['exchange'] = exchangeMock;

      await expect(service.cancelOrder(orderId, symbol)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
