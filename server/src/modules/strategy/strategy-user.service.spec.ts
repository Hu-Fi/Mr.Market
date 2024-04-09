import { Test, TestingModule } from '@nestjs/testing';
import { StrategyUserService } from './strategy-user.service';
import { StrategyUserRepository } from './strategy-user.repository';
import { CustomLogger } from '../logger/logger.service';
import { StrategyService } from './strategy.service';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import {
  type ArbitrageStates,
  type MarketMakingStates,
} from 'src/common/types/orders/states';
jest.mock('./strategy-user.repository');
jest.mock('../logger/logger.service');
jest.mock('./strategy.service');

describe('StrategyUserService', () => {
  let service: StrategyUserService;
  let repository: StrategyUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StrategyUserService,
        StrategyUserRepository,
        CustomLogger,
        StrategyService,
      ],
    }).compile();

    service = module.get<StrategyUserService>(StrategyUserService);
    repository = module.get<StrategyUserRepository>(StrategyUserRepository);
    jest.clearAllMocks();
  });

  describe('findAllStrategyByUser', () => {
    it('should return both arbitrage and market making orders', async () => {
      const mockUserId = 'd889bd3f-e01c-4871-b7a1-da0ebd5bfe0b';
      const mockArbitrageOrders = [
        {
          orderId: 'arb1',
          userId: 'user1',
          pair: 'BTC/USDT',
          amountToTrade: '0.5',
          minProfitability: '0.01',
          exchangeAName: 'ExchangeA',
          exchangeBName: 'ExchangeB',
          balanceA: '100',
          balanceB: '1000',
          state: 'created' as ArbitrageStates,
          createdAt: '2021-01-01T00:00:00.000Z',
        },
        {
          orderId: 'arb2',
          userId: 'user2',
          pair: 'ETH/USDT',
          amountToTrade: '1',
          minProfitability: '0.02',
          exchangeAName: 'ExchangeC',
          exchangeBName: 'ExchangeD',
          balanceA: '200',
          balanceB: '2000',
          state: 'created' as ArbitrageStates,
          createdAt: '2021-02-01T00:00:00.000Z',
        },
      ];
      const mockMarketMakingOrders = [
        {
          orderId: 'mm1',
          userId: 'user1',
          pair: 'BTC/USDT',
          exchangeName: 'ExchangeA',
          bidSpread: '0.001',
          askSpread: '0.001',
          orderAmount: '0.5',
          orderRefreshTime: '60', // Seconds
          numberOfLayers: '1',
          priceSourceType: PriceSourceType.MID_PRICE,
          amountChangePerLayer: '0.1',
          amountChangeType: 'percentage' as 'fixed' | 'percentage',
          ceilingPrice: '60000',
          floorPrice: '50000',
          balanceA: '100',
          balanceB: '1000',
          state: 'created' as MarketMakingStates,
          createdAt: '2021-01-01T00:00:00.000Z',
        },
        {
          orderId: 'mm2',
          userId: 'user2',
          pair: 'ETH/USDT',
          exchangeName: 'ExchangeB',
          bidSpread: '0.002',
          askSpread: '0.002',
          orderAmount: '1',
          orderRefreshTime: '120', // Seconds
          numberOfLayers: '2',
          priceSourceType: PriceSourceType.MID_PRICE,
          amountChangePerLayer: '0.2',
          amountChangeType: 'percentage' as 'fixed' | 'percentage',
          ceilingPrice: '4000',
          floorPrice: '3000',
          balanceA: '200',
          balanceB: '2000',
          state: 'created' as MarketMakingStates,
          createdAt: '2021-02-01T00:00:00.000Z',
        },
      ];

      jest
        .spyOn(repository, 'findArbitrageByUserId')
        .mockResolvedValue(mockArbitrageOrders);
      jest
        .spyOn(repository, 'findMarketMakingByUserId')
        .mockResolvedValue(mockMarketMakingOrders);

      const result = await service.findAllStrategyByUser(mockUserId);

      const expectedResult = [
        ...mockArbitrageOrders,
        ...mockMarketMakingOrders,
      ];

      expect(result).toEqual(expectedResult);
      expect(repository.findArbitrageByUserId).toHaveBeenCalledWith(mockUserId);
      expect(repository.findMarketMakingByUserId).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('updateArbitrageOrderState', () => {
    it('should update the state of an arbitrage order', async () => {
      const orderId = 'arb1';
      const newState = 'paused';

      jest
        .spyOn(repository, 'updateArbitrageOrderState')
        .mockResolvedValue(undefined);

      await service.updateArbitrageOrderState(orderId, newState);

      expect(repository.updateArbitrageOrderState).toHaveBeenCalledWith(
        orderId,
        newState,
      );
    });
  });

  describe('createArbitrage', () => {
    it('should successfully create an arbitrage order', async () => {
      const mockArbitrageOrder = {
        orderId: 'arb1',
        userId: 'user1',
        pair: 'BTC/USDT',
        amountToTrade: '0.5',
        minProfitability: '0.01',
        exchangeAName: 'ExchangeA',
        exchangeBName: 'ExchangeB',
        balanceA: '100',
        balanceB: '1000',
        state: 'created' as ArbitrageStates,
        createdAt: '2021-01-01T00:00:00.000Z',
      };

      jest
        .spyOn(repository, 'createArbitrage')
        .mockResolvedValue(mockArbitrageOrder);

      const result = await service.createArbitrage(mockArbitrageOrder);
      expect(result).toEqual(mockArbitrageOrder);
      expect(repository.createArbitrage).toHaveBeenCalledWith(
        mockArbitrageOrder,
      );
    });
  });

  describe('createMarketMaking', () => {
    it('should successfully create a market making order', async () => {
      const mockMarketMakingOrder = {
        orderId: 'mm1',
        userId: 'user1',
        pair: 'BTC/USDT',
        exchangeName: 'ExchangeA',
        bidSpread: '0.001',
        askSpread: '0.001',
        orderAmount: '0.5',
        orderRefreshTime: '60', // Seconds
        numberOfLayers: '1',
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: '0.1',
        amountChangeType: 'percentage' as 'fixed' | 'percentage',
        ceilingPrice: '60000',
        floorPrice: '50000',
        balanceA: '100',
        balanceB: '1000',
        state: 'created' as MarketMakingStates,
        createdAt: '2021-01-01T00:00:00.000Z',
      };

      jest
        .spyOn(repository, 'createMarketMaking')
        .mockResolvedValue(mockMarketMakingOrder);

      const result = await service.createMarketMaking(mockMarketMakingOrder);
      expect(result).toEqual(mockMarketMakingOrder);
      expect(repository.createMarketMaking).toHaveBeenCalledWith(
        mockMarketMakingOrder,
      );
    });
  });

  describe('updateMarketMakingOrderState', () => {
    it('should update the state of a market making order', async () => {
      const orderId = 'mm1';
      const newState = 'paused' as MarketMakingStates;

      jest
        .spyOn(repository, 'updateMarketMakingOrderState')
        .mockResolvedValue(undefined);

      await service.updateMarketMakingOrderState(orderId, newState);
      expect(repository.updateMarketMakingOrderState).toHaveBeenCalledWith(
        orderId,
        newState,
      );
    });
  });
});
