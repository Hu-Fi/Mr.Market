import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminGrowService } from './growdata/adminGrow.service';
import { AdminSpotService } from './spotData/adminSpot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  StartStrategyDto,
  StopStrategyDto,
} from './strategy/admin-strategy.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminStrategyService: AdminStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminStrategyService,
          useValue: {
            startStrategy: jest.fn(),
            stopStrategy: jest.fn(),
            getDepositAddress: jest.fn(),
            getSupportedNetworks: jest.fn(),
            getChainInfo: jest.fn(),
            getTokenSymbolByContract: jest.fn(),
            verifyContribution: jest.fn(),
            getRunningStrategies: jest.fn(),
          },
        },
        {
          provide: AdminGrowService,
          useValue: {
            addExchange: jest.fn(),
            removeExchange: jest.fn(),
            removeAllExchanges: jest.fn(),
            updateExchange: jest.fn(),
            addSimplyGrowToken: jest.fn(),
            removeSimplyGrowToken: jest.fn(),
            removeAllSimplyGrowTokens: jest.fn(),
            updateSimplyGrowToken: jest.fn(),
            addMarketMakingPair: jest.fn(),
            removeMarketMakingPair: jest.fn(),
            removeAllMarketMakingPairs: jest.fn(),
            updateMarketMakingPair: jest.fn(),
            addArbitragePair: jest.fn(),
            removeArbitragePair: jest.fn(),
            removeAllArbitragePairs: jest.fn(),
            updateArbitragePair: jest.fn(),
          },
        },
        {
          provide: AdminSpotService,
          useValue: {
            addTradingPair: jest.fn(),
            removeTradingPair: jest.fn(),
            removeAllTradingPairs: jest.fn(),
            updateTradingPair: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminController>(AdminController);
    adminStrategyService =
      module.get<AdminStrategyService>(AdminStrategyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Tests for AdminStrategyService
  it('should call startStrategy on AdminStrategyService', async () => {
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
    await controller.startStrategy(startStrategyDto);
    expect(adminStrategyService.startStrategy).toHaveBeenCalledWith(
      startStrategyDto,
    );
  });

  it('should call stopStrategy on AdminStrategyService', async () => {
    const stopStrategyDto: StopStrategyDto = {
      userId: '123',
      clientId: '456',
      strategyType: 'arbitrage',
    };
    await controller.stopStrategy(stopStrategyDto);
    expect(adminStrategyService.stopStrategy).toHaveBeenCalledWith(
      stopStrategyDto,
    );
  });
});
