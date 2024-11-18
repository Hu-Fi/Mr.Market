import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminGrowService } from './growdata/adminGrow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('AdminController', () => {
  let controller: AdminController;
  let adminStrategyService: AdminStrategyService;
  let adminGrowService: AdminGrowService;

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
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminController>(AdminController);
    adminStrategyService =
      module.get<AdminStrategyService>(AdminStrategyService);
    adminGrowService = module.get<AdminGrowService>(AdminGrowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
