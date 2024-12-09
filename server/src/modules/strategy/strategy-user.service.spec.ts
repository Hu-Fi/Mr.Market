import { Test, TestingModule } from '@nestjs/testing';
import { StrategyUserService } from './strategy-user.service';
import { StrategyUserRepository } from './strategy-user.repository';
import { CustomLogger } from '../logger/logger.service';
import { StrategyService } from './strategy.service';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import {
  type ArbitrageStates,
  type MarketMakingStates,
  type SimplyGrowStates,
} from 'src/common/types/orders/states';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SimplyGrowOrder } from 'src/common/entities/strategy-user.entity';

jest.mock('./strategy-user.repository');
jest.mock('../logger/logger.service');
jest.mock('./strategy.service');

describe('StrategyUserService', () => {
  let service: StrategyUserService;
  let strategyService: StrategyService;
  let strategyUserRepository: StrategyUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StrategyUserService,
        StrategyUserRepository,
        CustomLogger,
        StrategyService,
        ConfigModule,
        ConfigService,
      ],
    }).compile();

    service = module.get<StrategyUserService>(StrategyUserService);
    strategyService = module.get<StrategyService>(StrategyService);
    strategyUserRepository = module.get<StrategyUserRepository>(
      StrategyUserRepository,
    );
    jest.clearAllMocks();
  });

  describe('createSimplyGrow', () => {
    it('should successfully create a simply grow order', async () => {
      const mockSimplyGrowOrder = {
        orderId: 'sg1',
        userId: 'user1',
        version: 'v1',
        tradingType: 'typeA',
        action: 'buy',
        state: 'created' as SimplyGrowStates,
        createdAt: '2021-01-01T00:00:00.000Z',
        rewardAddress: '0x0000000000000000000000000000000000000000',
        mixinAssetId: '123e4567-e89b-12d3-a456-426614174000',
        amount: '100',
      };

      jest
        .spyOn(strategyUserRepository, 'createSimplyGrow')
        .mockResolvedValue(mockSimplyGrowOrder as SimplyGrowOrder);

      const result = await service.createSimplyGrow(mockSimplyGrowOrder);
      expect(result).toEqual(mockSimplyGrowOrder);
      expect(strategyUserRepository.createSimplyGrow).toHaveBeenCalledWith(
        mockSimplyGrowOrder,
      );
    });
  });

  describe('updateArbitrageOrderState', () => {
    it('should update the state of an arbitrage order', async () => {
      const orderId = 'arb1';
      const newState = 'paused';

      jest
        .spyOn(strategyUserRepository, 'updateArbitrageOrderState')
        .mockResolvedValue(undefined);

      await service.updateArbitrageOrderState(orderId, newState);

      expect(
        strategyUserRepository.updateArbitrageOrderState,
      ).toHaveBeenCalledWith(orderId, newState);
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
        rewardAddress: '0x0000000000000000000000000000000000000000',
      };

      jest
        .spyOn(strategyUserRepository, 'createArbitrage')
        .mockResolvedValue(mockArbitrageOrder);

      const result = await service.createArbitrage(mockArbitrageOrder);
      expect(result).toEqual(mockArbitrageOrder);
      expect(strategyUserRepository.createArbitrage).toHaveBeenCalledWith(
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
        rewardAddress: '0x0000000000000000000000000000000000000000',
      };

      jest
        .spyOn(strategyUserRepository, 'createMarketMaking')
        .mockResolvedValue(mockMarketMakingOrder);

      const result = await service.createMarketMaking(mockMarketMakingOrder);
      expect(result).toEqual(mockMarketMakingOrder);
      expect(strategyUserRepository.createMarketMaking).toHaveBeenCalledWith(
        mockMarketMakingOrder,
      );
    });
  });

  describe('updateMarketMakingOrderState', () => {
    it('should update the state of a market making order', async () => {
      const orderId = 'mm1';
      const newState = 'paused' as MarketMakingStates;

      jest
        .spyOn(strategyUserRepository, 'updateMarketMakingOrderState')
        .mockResolvedValue(undefined);

      await service.updateMarketMakingOrderState(orderId, newState);
      expect(
        strategyUserRepository.updateMarketMakingOrderState,
      ).toHaveBeenCalledWith(orderId, newState);
    });
  });

  it.failing(
    'should correctly handle both active and paused orders',
    async () => {
      // Mock data for running and paused orders
      const mockActiveArbOrders = [
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
          rewardAddress: '0x0000000000000000000000000000000000000000',
        },
      ];
      const mockActiveMMOrders = [
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
          rewardAddress: '0x0000000000000000000000000000000000000000',
        },
      ];
      const mockPausedArbOrders = [
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
          state: 'paused' as ArbitrageStates,
          createdAt: '2021-01-01T00:00:00.000Z',
          rewardAddress: '0x0000000000000000000000000000000000000000',
        },
      ];
      const mockPausedMMOrders = [
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
          state: 'paused' as MarketMakingStates,
          createdAt: '2021-01-01T00:00:00.000Z',
          rewardAddress: '0x0000000000000000000000000000000000000000',
        },
      ];

      jest
        .spyOn(strategyUserRepository, 'findRunningArbitrageOrders')
        .mockResolvedValue(mockActiveArbOrders);
      jest
        .spyOn(strategyUserRepository, 'findRunningMarketMakingOrders')
        .mockResolvedValue(mockActiveMMOrders);
      jest
        .spyOn(strategyUserRepository, 'findPausedArbitrageOrders')
        .mockResolvedValue(mockPausedArbOrders);
      jest
        .spyOn(strategyUserRepository, 'findPausedMarketMakingOrders')
        .mockResolvedValue(mockPausedMMOrders);

      // Mock strategy service methods to simulate starting and pausing strategies
      const startArbitrageSpy = jest
        .spyOn(strategyService, 'startArbitrageIfNotStarted')
        .mockImplementation(async () => {});
      const startMarketMakingSpy = jest
        .spyOn(strategyService, 'startMarketMakingIfNotStarted')
        .mockImplementation(async () => {});
      const pauseArbitrageSpy = jest
        .spyOn(strategyService, 'pauseStrategyIfNotPaused')
        .mockImplementation(async () => {});

      // Execute the method under test
      await service.updateExecutionBasedOnOrders();

      // Verify that strategies are started for the active orders
      expect(startArbitrageSpy).toHaveBeenCalledWith(expect.anything());
      expect(startMarketMakingSpy).toHaveBeenCalledWith(expect.anything());

      // Verify that strategies are paused for the paused orders
      expect(pauseArbitrageSpy).toHaveBeenCalledTimes(
        mockPausedArbOrders.length + mockPausedMMOrders.length,
      );
    },
  );
});
