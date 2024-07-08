import { Test, TestingModule } from '@nestjs/testing';
import {
  StrategyController,
  ArbitrageController,
  MarketMakingController,
} from './strategy.controller';
import { StrategyService } from './strategy.service';
import { StrategyUserService } from './strategy-user.service';
import {
  ArbitrageStrategyDto,
  PureMarketMakingStrategyDto,
} from './strategy.dto';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';

const mockStrategyService = {
  findAllStrategyByUser: jest.fn(),
  findPaymentStateById: jest.fn(),
  findArbitrageByUserId: jest.fn(),
  findArbitrageByOrderId: jest.fn(),
  getUserArbitrageHistorys: jest.fn(),
  startArbitrageStrategyForUser: jest.fn(),
  stopStrategyForUser: jest.fn(),
  findMarketMakingByUserId: jest.fn(),
  findMarketMakingByOrderId: jest.fn(),
  getUserOrders: jest.fn(),
  executePureMarketMakingStrategy: jest.fn(),
};

const mockStrategyUserService = {
  findAllStrategyByUser: jest.fn(),
  findPaymentStateById: jest.fn(),
  findArbitrageByUserId: jest.fn(),
  findArbitrageByOrderId: jest.fn(),
  findMarketMakingByUserId: jest.fn(),
  findMarketMakingByOrderId: jest.fn(),
};

describe('StrategyController', () => {
  let strategyController: StrategyController;
  let arbitrageController: ArbitrageController;
  let marketMakingController: MarketMakingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StrategyController,
        ArbitrageController,
        MarketMakingController,
      ],
      providers: [
        {
          provide: StrategyService,
          useValue: mockStrategyService,
        },
        {
          provide: StrategyUserService,
          useValue: mockStrategyUserService,
        },
      ],
    }).compile();

    strategyController = module.get<StrategyController>(StrategyController);
    arbitrageController = module.get<ArbitrageController>(ArbitrageController);
    marketMakingController = module.get<MarketMakingController>(
      MarketMakingController,
    );
  });

  it('StrategyController should be defined', () => {
    expect(strategyController).toBeDefined();
  });

  it('ArbitrageController should be defined', () => {
    expect(arbitrageController).toBeDefined();
  });

  it('MarketMakingController should be defined', () => {
    expect(marketMakingController).toBeDefined();
  });

  describe('StrategyController', () => {
    it('should return all strategies by user', async () => {
      const userId = 'user1';
      const result = [{ id: 1, name: 'Strategy1' }];
      mockStrategyUserService.findAllStrategyByUser.mockResolvedValue(result);

      expect(await strategyController.getAllStrategy(userId)).toBe(result);
      expect(
        mockStrategyUserService.findAllStrategyByUser,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return payment state by order ID', async () => {
      const orderId = 'order1';
      const result = { state: 'PAID' };
      mockStrategyUserService.findPaymentStateById.mockResolvedValue(result);

      expect(await strategyController.getPaymentState(orderId)).toBe(result);
      expect(mockStrategyUserService.findPaymentStateById).toHaveBeenCalledWith(
        orderId,
      );
    });
  });

  describe('ArbitrageController', () => {
    it('should return all arbitrage by user', async () => {
      const userId = 'user1';
      const result = [{ id: 1, name: 'Arbitrage1' }];
      mockStrategyUserService.findArbitrageByUserId.mockResolvedValue(result);

      expect(await arbitrageController.getAllArbitrageByUser(userId)).toBe(
        result,
      );
      expect(
        mockStrategyUserService.findArbitrageByUserId,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return arbitrage details by ID', async () => {
      const id = 'arbitrage1';
      const result = { id: 1, name: 'Arbitrage1' };
      mockStrategyUserService.findArbitrageByOrderId.mockResolvedValue(result);

      expect(await arbitrageController.getArbitrageDetailsById(id)).toBe(
        result,
      );
      expect(
        mockStrategyUserService.findArbitrageByOrderId,
      ).toHaveBeenCalledWith(id);
    });

    it('should return all arbitrage history by user', async () => {
      const userId = 'user1';
      const result = [{ id: 1, name: 'Arbitrage1' }];
      mockStrategyService.getUserArbitrageHistorys.mockResolvedValue(result);

      expect(await arbitrageController.getUserArbitrageOrders(userId)).toBe(
        result,
      );
      expect(mockStrategyService.getUserArbitrageHistorys).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should execute arbitrage strategy', async () => {
      const dto: ArbitrageStrategyDto = {
        userId: 'user1',
        clientId: 'client1',
        pair: 'ETH/USDT',
        amountToTrade: 1.0,
        minProfitability: 0.01,
        exchangeAName: 'binance',
        exchangeBName: 'mexc',
      };
      const result = { success: true };
      mockStrategyService.startArbitrageStrategyForUser.mockResolvedValue(
        result,
      );

      expect(await arbitrageController.executeArbitrage(dto)).toBe(result);
      expect(
        mockStrategyService.startArbitrageStrategyForUser,
      ).toHaveBeenCalledWith(dto);
    });

    it('should stop arbitrage strategy', async () => {
      const userId = 'user1';
      const clientId = 'client1';
      const result = { success: true };
      mockStrategyService.stopStrategyForUser.mockResolvedValue(result);

      expect(await arbitrageController.stopArbitrage(userId, clientId)).toBe(
        result,
      );
      expect(mockStrategyService.stopStrategyForUser).toHaveBeenCalledWith(
        userId,
        clientId,
        'arbitrage',
      );
    });
  });

  describe('MarketMakingController', () => {
    it('should return all market making by user', async () => {
      const userId = 'user1';
      const result = [{ id: 1, name: 'MarketMaking1' }];
      mockStrategyUserService.findMarketMakingByUserId.mockResolvedValue(
        result,
      );

      expect(
        await marketMakingController.getAllMarketMakingByUser(userId),
      ).toBe(result);
      expect(
        mockStrategyUserService.findMarketMakingByUserId,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return market making details by ID', async () => {
      const id = 'marketmaking1';
      const result = { id: 1, name: 'MarketMaking1' };
      mockStrategyUserService.findMarketMakingByOrderId.mockResolvedValue(
        result,
      );

      expect(await marketMakingController.getMarketMakingDetailsById(id)).toBe(
        result,
      );
      expect(
        mockStrategyUserService.findMarketMakingByOrderId,
      ).toHaveBeenCalledWith(id);
    });

    it('should return all market making history by user', async () => {
      const userId = 'user1';
      const result = [{ id: 1, name: 'MarketMaking1' }];
      mockStrategyService.getUserOrders.mockResolvedValue(result);

      expect(await marketMakingController.getUserOrders(userId)).toBe(result);
      expect(mockStrategyService.getUserOrders).toHaveBeenCalledWith(userId);
    });

    it('should execute market making strategy', async () => {
      const dto: PureMarketMakingStrategyDto = {
        userId: 'user1',
        clientId: 'client1',
        pair: 'BTC/USD',
        exchangeName: 'binance',
        bidSpread: 0.1,
        askSpread: 0.1,
        orderAmount: 0.1,
        orderRefreshTime: 15000,
        numberOfLayers: 1,
        priceSourceType: PriceSourceType.MID_PRICE,
        amountChangePerLayer: 1,
        amountChangeType: 'percentage',
        ceilingPrice: 0,
        floorPrice: 0,
      };
      const result = { success: true };
      mockStrategyService.executePureMarketMakingStrategy.mockResolvedValue(
        result,
      );

      expect(await marketMakingController.executePureMarketMaking(dto)).toBe(
        result,
      );
      expect(
        mockStrategyService.executePureMarketMakingStrategy,
      ).toHaveBeenCalledWith(dto);
    });

    it('should stop market making strategy', async () => {
      const userId = 'user1';
      const clientId = 'client1';
      const result = { success: true };
      mockStrategyService.stopStrategyForUser.mockResolvedValue(result);

      expect(
        await marketMakingController.stopPureMarketMaking(userId, clientId),
      ).toBe(result);
      expect(mockStrategyService.stopStrategyForUser).toHaveBeenCalledWith(
        userId,
        clientId,
        'pureMarketMaking',
      );
    });
  });
});
