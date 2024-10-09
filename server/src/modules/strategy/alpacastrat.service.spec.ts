import { Test, TestingModule } from '@nestjs/testing';
import { AlpacaStratService } from './alpacaStrat.service';
import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';
import { StrategyService } from './strategy.service';
import { Repository } from 'typeorm';
import { MarketMakingHistory } from 'src/common/entities/mm-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomLogger } from 'src/modules/logger/logger.service';
import * as ccxt from 'ccxt';
import { ArbitrageStrategyDto } from 'src/modules/strategy/strategy.dto';

describe('AlpacaStratService', () => {
  let service: AlpacaStratService;
  let exchangeInitService: ExchangeInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlpacaStratService,
        CustomLogger,
        {
          provide: ExchangeInitService,
          useValue: {
            getExchange: jest.fn(),
          },
        },
        {
          provide: StrategyService,
          useValue: {
            evaluateArbitrageOpportunityVWAP: jest.fn(),
          },
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

    service = module.get<AlpacaStratService>(AlpacaStratService);
    exchangeInitService = module.get<ExchangeInitService>(ExchangeInitService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startAlpacaArbitrageStrategy', () => {
    it('should start the strategy if not already running', async () => {
      const strategyParams: ArbitrageStrategyDto = {
        userId: 'user123',
        clientId: 'client123',
        pair: 'BTC/USD',
        exchangeBName: 'binance',
        amountToTrade: 0,
        minProfitability: 0,
        exchangeAName: '',
      };

      const alpacaExchange = new ccxt.binance(); // mock object for Alpaca exchange
      const exchangeB = new ccxt.binance(); // mock object for another exchange

      jest
        .spyOn(exchangeInitService, 'getExchange')
        .mockImplementationOnce(() => alpacaExchange)
        .mockImplementationOnce(() => exchangeB);

      service['strategyInstances'].clear(); // Ensure the strategy instance is not running

      await service.startAlpacaArbitrageStrategy(strategyParams, 5, 10);

      expect(exchangeInitService.getExchange).toHaveBeenCalledWith(
        'alpaca',
        'default',
      );
      expect(exchangeInitService.getExchange).toHaveBeenCalledWith('binance');
      expect(service['strategyInstances'].size).toBe(1);
    });
  });

  describe('startAlpacaDerivativesArbitrage', () => {
    it('should start the derivatives arbitrage strategy if not already running', async () => {
      const strategyParams: ArbitrageStrategyDto = {
        userId: 'user123',
        clientId: 'client123',
        pair: 'BTC/USD',
        exchangeBName: 'binance',
        amountToTrade: 1,
        minProfitability: 0.01,
        exchangeAName: '',
      };

      const alpacaExchange = new ccxt.binance(); // mock object for Alpaca exchange
      const exchangeB = new ccxt.binance(); // mock object for another exchange

      jest
        .spyOn(exchangeInitService, 'getExchange')
        .mockImplementationOnce(() => alpacaExchange)
        .mockImplementationOnce(() => exchangeB);

      service['strategyInstances'].clear(); // Ensure the strategy instance is not running

      await service.startAlpacaDerivativesArbitrage(
        strategyParams,
        'futures',
        5,
      );

      expect(exchangeInitService.getExchange).toHaveBeenCalledWith(
        'alpaca',
        'default',
      );
      expect(exchangeInitService.getExchange).toHaveBeenCalledWith('binance');
      expect(service['strategyInstances'].size).toBe(1);
    });
  });
});
