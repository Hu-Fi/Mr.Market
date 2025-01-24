import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SpotdataService } from './spotdata.service';
import { SpotdataRepository } from './spotdata.repository';
import { MarketdataService } from '../marketdata/marketdata.service';
import { ExchangeService } from '../mixin/exchange/exchange.service';
import { AdminSettingsService } from '../admin/settings/adminSettings.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { Cache } from 'cache-manager';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';

describe('SpotdataService', () => {
  let service: SpotdataService;
  let cacheService: Cache;
  let spotdataRepository: SpotdataRepository;
  let exchangeService: ExchangeService;
  let settingsService: AdminSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotdataService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: SpotdataRepository,
          useValue: {
            addTradingPair: jest.fn(),
            findAllTradingPairs: jest.fn(),
            findTradingPairById: jest.fn(),
            removeTradingPair: jest.fn(),
            updateTradingPair: jest.fn(),
          },
        },
        {
          provide: MarketdataService,
          useValue: {
            getTickers: jest.fn(),
          },
        },
        {
          provide: ExchangeService,
          useValue: {
            readAllAPIKeys: jest.fn(),
          },
        },
        {
          provide: AdminSettingsService,
          useValue: {
            getSpotFee: jest.fn(),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpotdataService>(SpotdataService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
    spotdataRepository = module.get<SpotdataRepository>(SpotdataRepository);
    exchangeService = module.get<ExchangeService>(ExchangeService);
    settingsService = module.get<AdminSettingsService>(AdminSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpotData', () => {
    it('should return spot data', async () => {
      const mockPairs: SpotdataTradingPair[] = [
        {
          id: '1',
          symbol: 'BTC/USD',
          ccxt_id: 'btc_usd',
          exchange_id: 'binance',
          base_asset_id: 'BTC',
          quote_asset_id: 'USD',
          amount_significant_figures: '8',
          price_significant_figures: '2',
          max_buy_amount: '10',
          max_sell_amount: '10',
          buy_decimal_digits: '2',
          sell_decimal_digits: '2',
          enable: true,
        },
      ];
      const mockExchanges = ['binance'];
      const mockFee = '0.1';

      jest.spyOn(service, 'getSupportedPairs').mockResolvedValue(mockPairs);
      jest.spyOn(exchangeService, 'readAllAPIKeys').mockResolvedValue([
        {
          exchange: 'binance',
          key_id: 'key',
          name: 'name',
          api_key: 'api_key',
          api_secret: 'api_secret',
          api_extra: 'api_extra',
          enable: true,
        },
      ]);
      jest.spyOn(settingsService, 'getSpotFee').mockResolvedValue(mockFee);

      const result = await service.getSpotData();

      expect(result).toEqual({
        exchanges: mockExchanges,
        trading_pairs: mockPairs,
        fee: { spot: mockFee },
      });
    });
  });

  describe('addTradingPair', () => {
    it('should add a trading pair', async () => {
      const mockPair: SpotdataTradingPair = {
        id: '1',
        symbol: 'BTC/USD',
        ccxt_id: 'btc_usd',
        exchange_id: 'binance',
        base_asset_id: 'BTC',
        quote_asset_id: 'USD',
        amount_significant_figures: '8',
        price_significant_figures: '2',
        max_buy_amount: '10',
        max_sell_amount: '10',
        buy_decimal_digits: '2',
        sell_decimal_digits: '2',
        enable: true,
      };
      jest
        .spyOn(spotdataRepository, 'addTradingPair')
        .mockResolvedValue(mockPair);

      const result = await service.addTradingPair(mockPair);

      expect(result).toEqual(mockPair);
      expect(spotdataRepository.addTradingPair).toHaveBeenCalledWith(mockPair);
    });
  });

  describe('getSupportedPairs', () => {
    it('should return supported pairs from cache', async () => {
      const mockPairs: SpotdataTradingPair[] = [
        {
          id: '1',
          symbol: 'BTC/USD',
          ccxt_id: 'btc_usd',
          exchange_id: 'binance',
          base_asset_id: 'BTC',
          quote_asset_id: 'USD',
          amount_significant_figures: '8',
          price_significant_figures: '2',
          max_buy_amount: '10',
          max_sell_amount: '10',
          buy_decimal_digits: '2',
          sell_decimal_digits: '2',
          enable: true,
        },
      ];
      jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(JSON.stringify(mockPairs));

      const result = await service.getSupportedPairs();

      expect(result).toEqual(mockPairs);
      expect(cacheService.get).toHaveBeenCalledWith('supported-spotdata-pairs');
    });

    it('should return supported pairs from repository if not cached', async () => {
      const mockPairs: any[] = [
        {
          id: '1',
          symbol: 'BTC/USD',
          ccxt_id: 'btc_usd',
          exchange_id: 'binance',
          base_asset_id: 'BTC',
          quote_asset_id: 'USD',
          amount_significant_figures: '8',
          price_significant_figures: '2',
          max_buy_amount: '10',
          max_sell_amount: '10',
          buy_decimal_digits: '2',
          change: '0',
          price: '0',
          sell_decimal_digits: '2',
          enable: true,
        },
      ];
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(spotdataRepository, 'findAllTradingPairs')
        .mockResolvedValue(mockPairs);
      jest.spyOn(cacheService, 'set').mockResolvedValue(Promise.resolve());

      const result = await service.getSupportedPairs();

      expect(result).toEqual(mockPairs);
      expect(spotdataRepository.findAllTradingPairs).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith(
        'supported-spotdata-pairs',
        JSON.stringify(mockPairs),
        { ttl: 5 },
      );
    });
  });
});
