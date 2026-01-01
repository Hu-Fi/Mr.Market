import { Test, TestingModule } from '@nestjs/testing';
import { UserOrdersService } from './user-orders.service';
import { CustomLogger } from '../../infrastructure/logger/logger.service';
import { StrategyService } from '../strategy/strategy.service';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import {
  type ArbitrageStates,
  type MarketMakingStates,
  type SimplyGrowStates,
} from 'src/common/types/orders/states';
import { ConfigService } from '@nestjs/config';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from 'src/common/entities/user-orders.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';

jest.mock('../logger/logger.service');
jest.mock('../strategy/strategy.service');

describe('UserOrdersService', () => {
  let service: UserOrdersService;
  let strategyService: StrategyService;
  let arbitrageRepository: Repository<ArbitrageOrder>;
  let marketMakingRepository: Repository<MarketMakingOrder>;
  let simplyGrowRepository: Repository<SimplyGrowOrder>;
  let paymentStateRepository: Repository<PaymentState>;
  let marketMakingHistoryRepository: Repository<MarketMakingHistory>;
  let arbitrageHistoryRepository: Repository<ArbitrageHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOrdersService,
        CustomLogger,
        StrategyService,
        ConfigService,
        {
          provide: getRepositoryToken(ArbitrageOrder),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MarketMakingOrder),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SimplyGrowOrder),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PaymentState),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MarketMakingHistory),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ArbitrageHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserOrdersService>(UserOrdersService);
    strategyService = module.get<StrategyService>(StrategyService);
    arbitrageRepository = module.get<Repository<ArbitrageOrder>>(
      getRepositoryToken(ArbitrageOrder),
    );
    marketMakingRepository = module.get<Repository<MarketMakingOrder>>(
      getRepositoryToken(MarketMakingOrder),
    );
    simplyGrowRepository = module.get<Repository<SimplyGrowOrder>>(
      getRepositoryToken(SimplyGrowOrder),
    );
    paymentStateRepository = module.get<Repository<PaymentState>>(
      getRepositoryToken(PaymentState),
    );
    marketMakingHistoryRepository = module.get<Repository<MarketMakingHistory>>(
      getRepositoryToken(MarketMakingHistory),
    );
    arbitrageHistoryRepository = module.get<Repository<ArbitrageHistory>>(
      getRepositoryToken(ArbitrageHistory),
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
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
        mixinAssetId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100,
      } as unknown as SimplyGrowOrder;

      jest
        .spyOn(simplyGrowRepository, 'save')
        .mockResolvedValue(mockSimplyGrowOrder);

      const result = await service.createSimplyGrow(mockSimplyGrowOrder);
      expect(result).toEqual(mockSimplyGrowOrder);
      expect(simplyGrowRepository.save).toHaveBeenCalledWith(
        mockSimplyGrowOrder,
      );
    });
  });

  describe('updateArbitrageOrderState', () => {
    it('should update the state of an arbitrage order', async () => {
      const orderId = 'arb1';
      const newState = 'paused';

      jest.spyOn(arbitrageRepository, 'update').mockResolvedValue(undefined);

      await service.updateArbitrageOrderState(orderId, newState);

      expect(arbitrageRepository.update).toHaveBeenCalledWith(
        { orderId },
        { state: newState },
      );
    });
  });

  describe('createArbitrage', () => {
    it('should successfully create an arbitrage order', async () => {
      const mockArbitrageOrder = {
        orderId: 'arb1',
        userId: 'user1',
        pair: 'BTC/USDT',
        amountToTrade: 0.5,
        minProfitability: 0.01,
        exchangeAName: 'ExchangeA',
        exchangeBName: 'ExchangeB',
        balanceA: 100,
        balanceB: 1000,
        state: 'created' as ArbitrageStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      } as unknown as ArbitrageOrder;

      jest
        .spyOn(arbitrageRepository, 'save')
        .mockResolvedValue(mockArbitrageOrder);

      const result = await service.createArbitrage(mockArbitrageOrder);
      expect(result).toEqual(mockArbitrageOrder);
      expect(arbitrageRepository.save).toHaveBeenCalledWith(mockArbitrageOrder);
    });
  });

  describe('createMarketMaking', () => {
    it('should successfully create a market making order', async () => {
      const mockMarketMakingOrder = {
        orderId: 'mm1',
        userId: 'user1',
        pair: 'BTC/USDT',
        exchangeName: 'ExchangeA',
        bidSpread: 0.001,
        askSpread: 0.001,
        orderAmount: 0.5,
        orderRefreshTime: 60, // Seconds
        numberOfLayers: 1,
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: 0.1,
        amountChangeType: 'percentage' as 'fixed' | 'percentage',
        ceilingPrice: 60000,
        floorPrice: 50000,
        balanceA: 100,
        balanceB: 1000,
        state: 'created' as MarketMakingStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      } as unknown as MarketMakingOrder;

      jest
        .spyOn(marketMakingRepository, 'save')
        .mockResolvedValue(mockMarketMakingOrder);

      const result = await service.createMarketMaking(mockMarketMakingOrder);
      expect(result).toEqual(mockMarketMakingOrder);
      expect(marketMakingRepository.save).toHaveBeenCalledWith(
        mockMarketMakingOrder,
      );
    });
  });

  describe('updateMarketMakingOrderState', () => {
    it('should update the state of a market making order', async () => {
      const orderId = 'mm1';
      const newState = 'paused' as MarketMakingStates;

      jest.spyOn(marketMakingRepository, 'update').mockResolvedValue(undefined);

      await service.updateMarketMakingOrderState(orderId, newState);
      expect(marketMakingRepository.update).toHaveBeenCalledWith(
        { orderId },
        { state: newState },
      );
    });
  });

  it('should correctly handle both active and paused orders', async () => {
    // Mock data for running and paused orders
    const mockActiveArbOrders = [
      {
        orderId: 'arb1',
        userId: 'user1',
        pair: 'BTC/USDT',
        amountToTrade: 0.5,
        minProfitability: 0.01,
        exchangeAName: 'ExchangeA',
        exchangeBName: 'ExchangeB',
        balanceA: 100,
        balanceB: 1000,
        state: 'created' as ArbitrageStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      },
    ] as unknown as ArbitrageOrder[];
    const mockActiveMMOrders = [
      {
        orderId: 'mm1',
        userId: 'user1',
        pair: 'BTC/USDT',
        exchangeName: 'ExchangeA',
        bidSpread: 0.001,
        askSpread: 0.001,
        orderAmount: 0.5,
        orderRefreshTime: 60, // Seconds
        numberOfLayers: 1,
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: 0.1,
        amountChangeType: 'percentage' as 'fixed' | 'percentage',
        ceilingPrice: 60000,
        floorPrice: 50000,
        balanceA: 100,
        balanceB: 1000,
        state: 'created' as MarketMakingStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      },
    ] as unknown as MarketMakingOrder[];
    const mockPausedArbOrders = [
      {
        orderId: 'arb1',
        userId: 'user1',
        pair: 'BTC/USDT',
        amountToTrade: 0.5,
        minProfitability: 0.01,
        exchangeAName: 'ExchangeA',
        exchangeBName: 'ExchangeB',
        balanceA: 100,
        balanceB: 1000,
        state: 'paused' as ArbitrageStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      },
    ] as unknown as ArbitrageOrder[];
    const mockPausedMMOrders = [
      {
        orderId: 'mm1',
        userId: 'user1',
        pair: 'BTC/USDT',
        exchangeName: 'ExchangeA',
        bidSpread: 0.001,
        askSpread: 0.001,
        orderAmount: 0.5,
        orderRefreshTime: 60, // Seconds
        numberOfLayers: 1,
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: 0.1,
        amountChangeType: 'percentage' as 'fixed' | 'percentage',
        ceilingPrice: 60000,
        floorPrice: 50000,
        balanceA: 100,
        balanceB: 1000,
        state: 'paused' as MarketMakingStates,
        createdAt: new Date(),
        rewardAddress: '0x0000000000000000000000000000000000000000',
      },
    ] as unknown as MarketMakingOrder[];

    jest
      .spyOn(arbitrageRepository, 'findBy')
      .mockImplementation(async (criteria: any) => {
        if (criteria.state === 'created') return mockActiveArbOrders;
        if (criteria.state === 'paused') return mockPausedArbOrders;
        return [];
      });
    jest
      .spyOn(marketMakingRepository, 'findBy')
      .mockImplementation(async (criteria: any) => {
        if (criteria.state === 'created') return mockActiveMMOrders;
        if (criteria.state === 'paused') return mockPausedMMOrders;
        return [];
      });

    // Mock strategy service methods to simulate starting and pausing strategies
    const startArbitrageSpy = jest
      .spyOn(strategyService, 'startArbitrageIfNotStarted')
      .mockImplementation(async () => { });
    const startMarketMakingSpy = jest
      .spyOn(strategyService, 'startMarketMakingIfNotStarted')
      .mockImplementation(async () => { });
    const pauseArbitrageSpy = jest
      .spyOn(strategyService, 'pauseStrategyIfNotPaused')
      .mockImplementation(async () => { });

    // Execute the method under test
    await service.updateExecutionBasedOnOrders();

    // Verify that strategies are started for the active orders
    expect(startArbitrageSpy).toHaveBeenCalled();
    expect(startMarketMakingSpy).toHaveBeenCalled();

    // Verify that strategies are paused for the paused orders
    expect(pauseArbitrageSpy).toHaveBeenCalledTimes(
      mockPausedArbOrders.length + mockPausedMMOrders.length,
    );
  });
});
