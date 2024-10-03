import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import { BadRequestException } from '@nestjs/common';
import { StartStrategyDto, StopStrategyDto } from './admin-strategy.dto';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';

describe('AdminService', () => {
  let service: AdminService;
  let strategyService: StrategyService;
  let performanceService: PerformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: StrategyService,
          useValue: {
            startArbitrageStrategyForUser: jest.fn(),
            executePureMarketMakingStrategy: jest.fn(),
            executeVolumeStrategy: jest.fn(),
            stopStrategyForUser: jest.fn(),
          },
        },
        {
          provide: PerformanceService,
          useValue: {
            getPerformanceByStrategy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    strategyService = module.get<StrategyService>(StrategyService);
    performanceService = module.get<PerformanceService>(PerformanceService);
    console.log(performanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startStrategy', () => {
    it('should start an arbitrage strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'arbitrage',
        arbitrageParams: {
          userId: 'user123',
          clientId: 'client123',
          pair: 'ETH/USDT',
          amountToTrade: 1.0,
          minProfitability: 0.01,
          exchangeAName: 'binance',
          exchangeBName: 'mexc',
          checkIntervalSeconds: 10,
          maxOpenOrders: 5,
        },
        checkIntervalSeconds: 10,
        maxOpenOrders: 5,
      };

      await service.startStrategy(startStrategyDto);

      expect(
        strategyService.startArbitrageStrategyForUser,
      ).toHaveBeenCalledWith(
        startStrategyDto.arbitrageParams,
        startStrategyDto.checkIntervalSeconds,
        startStrategyDto.maxOpenOrders,
      );
    });

    it('should start a market making strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'marketMaking',
        marketMakingParams: {
          userId: 'user123',
          clientId: 'client123',
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
        },
      };

      await service.startStrategy(startStrategyDto);

      expect(
        strategyService.executePureMarketMakingStrategy,
      ).toHaveBeenCalledWith(startStrategyDto.marketMakingParams);
    });

    it('should start a volume strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'volume',
        volumeParams: {
          exchangeName: 'Binance',
          symbol: 'BTCUSDT',
          incrementPercentage: 0.1,
          intervalTime: 60,
          tradeAmount: 100,
          numTrades: 5,
          userId: 'user123',
          clientId: 'client123',
        },
      };

      await service.startStrategy(startStrategyDto);

      expect(strategyService.executeVolumeStrategy).toHaveBeenCalledWith(
        startStrategyDto.volumeParams.exchangeName,
        startStrategyDto.volumeParams.symbol,
        startStrategyDto.volumeParams.incrementPercentage,
        startStrategyDto.volumeParams.intervalTime,
        startStrategyDto.volumeParams.tradeAmount,
        startStrategyDto.volumeParams.numTrades,
        startStrategyDto.volumeParams.userId,
        startStrategyDto.volumeParams.clientId,
      );
    });

    it('should throw BadRequestException for invalid strategy parameters', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'arbitrage', // No arbitrageParams provided
      };

      await expect(service.startStrategy(startStrategyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('stopStrategy', () => {
    it('should stop a strategy', async () => {
      const stopStrategyDto: StopStrategyDto = {
        strategyType: 'arbitrage',
        userId: 'user123',
        clientId: 'client123',
      };

      await service.stopStrategy(stopStrategyDto);

      expect(strategyService.stopStrategyForUser).toHaveBeenCalledWith(
        stopStrategyDto.userId,
        stopStrategyDto.clientId,
        stopStrategyDto.strategyType,
      );
    });
  });
});
