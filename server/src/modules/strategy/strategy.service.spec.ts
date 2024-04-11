import { Test, TestingModule } from '@nestjs/testing';
import { StrategyService } from './strategy.service';
import { TradeService } from '../trade/trade.service';
import { PerformanceService } from '../performance/performance.service';
import { CustomLogger } from '../logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as ccxt from 'ccxt';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { PureMarketMakingStrategyDto } from './strategy.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';

// Mocking the TradeService
class TradeServiceMock {
  async executeLimitTrade() {}
}

// Mocking the PerformanceService
class PerformanceServiceMock {
  async recordPerformance() {}
}

describe('StrategyService', () => {
  let service: StrategyService;

  // Example mock repository implementation
  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // Add other repository methods as needed
  };

  const mockArbitrageOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // Add other repository methods as needed
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StrategyService,

        { provide: TradeService, useClass: TradeServiceMock },
        { provide: PerformanceService, useClass: PerformanceServiceMock },
        {
          provide: getRepositoryToken(MarketMakingHistory),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(ArbitrageHistory),
          useValue: mockArbitrageOrderRepository,
        },

        {
          provide: CustomLogger,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StrategyService>(StrategyService);

    // Initialize activeOrderBookWatches map
    service['activeOrderBookWatches'].set(
      '1-client1-arbitrage',
      new Set<string>(),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSupportedExchanges', () => {
    it('should return an array of supported exchanges', async () => {
      const exchanges = await service.getSupportedExchanges();
      expect(exchanges).toEqual(
        expect.arrayContaining(['bitfinex', 'mexc', 'binance']),
      );
    });
  });

  describe('startArbitrageStrategyForUser', () => {
    it('should start an arbitrage strategy for the user', async () => {
      const strategyParamsDto = {
        userId: '1',
        clientId: 'client1',
        pair: 'BTC/USDT',
        exchangeAName: 'bitfinex',
        exchangeBName: 'mexc',
        minProfitability: -1,
        amountToTrade: 0.1,
      };
      await service.startArbitrageStrategyForUser(strategyParamsDto);
      expect(
        service['strategyInstances'].has('1-client1-arbitrage'),
      ).toBeTruthy();
    });

    it('should throw InternalServerErrorException if exchanges are not configured', async () => {
      const strategyParamsDto = {
        userId: '1',
        clientId: 'client1',
        pair: 'BTC/USDT',
        exchangeAName: 'unknownExchange',
        exchangeBName: 'mexc',
        minProfitability: -1,
        amountToTrade: 0.1,
      };
      await expect(
        service.startArbitrageStrategyForUser(strategyParamsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('executePureMarketMakingStrategy', () => {
    it('should start a pure market making strategy for the user', async () => {
      const strategyParamsDto: PureMarketMakingStrategyDto = {
        userId: '1',
        clientId: 'client1',
        pair: 'BTC/USDT',
        exchangeName: 'bitfinex',
        bidSpread: 0.1,
        askSpread: 0.1,
        orderAmount: 1,
        orderRefreshTime: 1000,
        numberOfLayers: 5,
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: 0.1,
        amountChangeType: 'percentage', // Corrected value
        ceilingPrice: undefined, // Add other required properties if needed
        floorPrice: undefined, // Add other required properties if needed
      };

      await service.executePureMarketMakingStrategy(strategyParamsDto);

      expect(
        service['strategyInstances'].has('1-client1-pureMarketMaking'),
      ).toBeTruthy();
    });
  });

  describe('cancelAllOrders', () => {
    it('should cancel all open orders for the given pair', async () => {
      const exchange = new ccxt.Exchange();
      exchange.fetchOpenOrders = jest.fn().mockResolvedValue([
        { id: 'order1', symbol: 'BTC/USDT' },
        { id: 'order2', symbol: 'BTC/USDT' },
      ]);
      exchange.cancelOrder = jest.fn().mockResolvedValue(undefined);

      const pair = 'BTC/USDT';
      const strategyKey = '1-client1-pureMarketMaking';

      await service['cancelAllOrders'](exchange, pair, strategyKey);

      expect(exchange.fetchOpenOrders).toHaveBeenCalledWith(pair);
      expect(exchange.cancelOrder).toHaveBeenCalledWith('order1', pair);
      expect(exchange.cancelOrder).toHaveBeenCalledWith('order2', pair);
    });
  });

  describe('executeArbitrageTradeWithLimitOrders', () => {
    it('should execute arbitrage trade with limit orders and record performance', async () => {
      const userId = '1';
      const clientId = 'client1';
      const exchangeA = new ccxt.Exchange();
      const exchangeB = new ccxt.Exchange();
      const symbol = 'BTC/USDT';
      const amount = 1;
      const buyPrice = 48000;
      const sellPrice = 49000;

      const executeLimitTradeMock = jest.fn().mockResolvedValue({});
      service['tradeService'] = {
        executeLimitTrade: executeLimitTradeMock,
      } as any; // Mock TradeService

      await service['executeArbitrageTradeWithLimitOrders'](
        exchangeA,
        exchangeB,
        symbol,
        amount,
        userId,
        clientId,
        buyPrice,
        sellPrice,
      );

      expect(executeLimitTradeMock).toHaveBeenCalledWith({
        userId,
        clientId,
        exchange: exchangeA.id,
        symbol,
        side: 'buy',
        amount,
        price: buyPrice,
      });
      expect(executeLimitTradeMock).toHaveBeenCalledWith({
        userId,
        clientId,
        exchange: exchangeB.id,
        symbol,
        side: 'sell',
        amount,
        price: sellPrice,
      });
    });
  });

  // Add more tests for other methods as needed...
});
