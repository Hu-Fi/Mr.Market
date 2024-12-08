import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminStrategyService } from './strategy/adminStrategy.service';
import { AdminGrowService } from './growdata/adminGrow.service';
import { AdminSpotService } from './spotData/adminSpot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SpotdataTradingPairDto } from './spotData/adminSpot.dto';
import {
  StartStrategyDto,
  StopStrategyDto,
} from './strategy/admin-strategy.dto';
import { GrowdataExchangeDto } from './growdata/adminGrow.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminStrategyService: AdminStrategyService;
  let adminGrowService: AdminGrowService;
  let adminSpotService: AdminSpotService;

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
    adminGrowService = module.get<AdminGrowService>(AdminGrowService);
    adminSpotService = module.get<AdminSpotService>(AdminSpotService);
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

  // Tests for AdminGrowService
  it('should call addExchange on AdminGrowService', async () => {
    const exchangeDto: GrowdataExchangeDto = {
      exchange_id: 'binance',
      name: 'Binance',
      enable: true,
    };
    await controller.addExchange(exchangeDto);
    expect(adminGrowService.addExchange).toHaveBeenCalledWith(exchangeDto);
  });

  it('should call removeExchange on AdminGrowService', async () => {
    const exchange_id = 'binance';
    await controller.removeExchange(exchange_id);
    expect(adminGrowService.removeExchange).toHaveBeenCalledWith(exchange_id);
  });

  it('should call removeAllExchanges on AdminGrowService', async () => {
    await controller.removeAllExchanges();
    expect(adminGrowService.removeAllExchanges).toHaveBeenCalled();
  });

  it('should call updateExchange on AdminGrowService', async () => {
    const exchange_id = 'binance';
    const modifications = { name: 'New Binance' };
    await controller.updateExchange(exchange_id, modifications);
    expect(adminGrowService.updateExchange).toHaveBeenCalledWith(
      exchange_id,
      modifications,
    );
  });

  // Existing tests for AdminSpotService
  it('should call addTradingPair on AdminSpotService', async () => {
    const pairDto: SpotdataTradingPairDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ccxt_id: 'binance',
      symbol: 'BTC/USDT',
      exchange_id: 'binance',
      amount_significant_figures: '8',
      price_significant_figures: '2',
      buy_decimal_digits: '2',
      sell_decimal_digits: '2',
      max_buy_amount: '1000',
      max_sell_amount: '1000',
      base_asset_id: '7e04727a-6f8b-499a-92d0-18bf4ef013bb',
      quote_asset_id: 'ccde90fe-d611-4fc8-afb4-3388e96fbb02',
      enable: true,
    };

    await controller.addTradingPair(pairDto);
    expect(adminSpotService.addTradingPair).toHaveBeenCalledWith(pairDto);
  });

  it('should call removeTradingPair on AdminSpotService', async () => {
    const id = 'mock-id';
    await controller.removeTradingPair(id);
    expect(adminSpotService.removeTradingPair).toHaveBeenCalledWith(id);
  });

  it('should call removeAllTradingPairs on AdminSpotService', async () => {
    await controller.removeAllTradingPairs();
    expect(adminSpotService.removeAllTradingPairs).toHaveBeenCalled();
  });

  it('should call updateTradingPair on AdminSpotService', async () => {
    const id = 'mock-id';
    const modifications = {
      // mock modifications
    };
    await controller.updateTradingPair(id, modifications);
    expect(adminSpotService.updateTradingPair).toHaveBeenCalledWith(
      id,
      modifications,
    );
  });
});
