import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SpotdataService } from './spotdata.service';
import { SpotdataRepository } from './spotdata.repository';
import { MarketdataService } from '../marketdata/marketdata.service';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../logger/logger.service';
import { Tickers } from 'ccxt';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';

describe('SpotdataService', () => {
  let service: SpotdataService;
  let repository: SpotdataRepository;
  let marketdataService: MarketdataService;
  let cacheService: Cache;

  const mockTradingPairs: SpotdataTradingPair[] = [
    {
      id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      symbol: 'BTC/USDT',
      exchange_id: 'binance',
      base_asset_id: '7e04727a-6f8b-499a-92d0-18bf4ef013bb',
      quote_asset_id: 'ccde90fe-d611-4fc8-afb4-3388e96fbb02',
      ccxt_id: 'binance',
      max_buy_amount: '1000',
      max_sell_amount: '1000',
      enable: true,
      amount_significant_figures: '8',
      price_significant_figures: '2',
      buy_decimal_digits: '2',
      sell_decimal_digits: '2',
    },
    {
      id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      symbol: 'ETH/USDT',
      exchange_id: 'binance',
      base_asset_id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      quote_asset_id: 'ccde90fe-d611-4fc8-afb4-3388e96fbb02',
      ccxt_id: 'binance',
      max_buy_amount: '1000',
      max_sell_amount: '1000',
      enable: true,
      amount_significant_figures: '8',
      price_significant_figures: '2',
      buy_decimal_digits: '2',
      sell_decimal_digits: '2',
    },
  ];

  const mockTickers: Tickers = {
    'BTC/USDT': {
      symbol: 'BTC/USDT',
      info: {},
      timestamp: Date.now(),
      datetime: new Date().toISOString(),
      high: 0,
      low: 0,
      bid: 0,
      ask: 0,
      last: 0,
      change: 0,
      percentage: 1.5,
      baseVolume: 0,
      quoteVolume: 0,
      bidVolume: 0,
      askVolume: 0,
      vwap: 0,
      open: 0,
      close: 0,
      previousClose: 0,
      average: 0,
    },
    'ETH/USDT': {
      symbol: 'ETH/USDT',
      info: {},
      timestamp: Date.now(),
      datetime: new Date().toISOString(),
      high: 0,
      low: 0,
      bid: 0,
      ask: 0,
      last: 0,
      change: 0,
      percentage: 2.0,
      baseVolume: 0,
      quoteVolume: 0,
      bidVolume: 0,
      askVolume: 0,
      vwap: 0,
      open: 0,
      close: 0,
      previousClose: 0,
      average: 0,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotdataService,
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
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpotdataService>(SpotdataService);
    repository = module.get<SpotdataRepository>(SpotdataRepository);
    marketdataService = module.get<MarketdataService>(MarketdataService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpotData', () => {
    it('should return spot data successfully', async () => {
      const expectedPairs = mockTradingPairs.map((pair) => ({
        ...pair,
        change: mockTickers[pair.symbol].percentage,
      }));

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(repository, 'findAllTradingPairs')
        .mockResolvedValue(mockTradingPairs);
      jest
        .spyOn(marketdataService, 'getTickers')
        .mockResolvedValue(mockTickers);

      const result = await service.getSpotData();
      expect(result).toEqual({
        trading_pairs: expectedPairs,
      });
    });

    it('should handle errors and return error response', async () => {
      jest
        .spyOn(repository, 'findAllTradingPairs')
        .mockRejectedValue(new Error('Database error'));

      const result = await service.getSpotData();
      expect(result).toEqual({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Database error',
      });
    });
  });

  describe('getSupportedPairs', () => {
    it('should return cached data when available', async () => {
      const cachedPairs = [{ id: 'cached-pair' }];
      jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(JSON.stringify(cachedPairs));

      const result = await service.getSupportedPairs();
      expect(result).toEqual(cachedPairs);
      expect(cacheService.get).toHaveBeenCalledWith('supported-spotdata-pairs');
    });
  });

  describe('getTradingPairById', () => {
    it('should return trading pair when found', async () => {
      const pair = mockTradingPairs[0];
      jest.spyOn(repository, 'findTradingPairById').mockResolvedValue(pair);

      const result = await service.getTradingPairById(pair.id);
      expect(result).toEqual(pair);
    });

    it('should return null when trading pair not found', async () => {
      jest.spyOn(repository, 'findTradingPairById').mockResolvedValue(null);

      const result = await service.getTradingPairById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('addTradingPair', () => {
    it('should add trading pair successfully', async () => {
      const newPair = mockTradingPairs[0];
      jest.spyOn(repository, 'addTradingPair').mockResolvedValue(newPair);

      const result = await service.addTradingPair(newPair);
      expect(result).toEqual(newPair);
      expect(repository.addTradingPair).toHaveBeenCalledWith(newPair);
    });

    it('should throw error when adding trading pair fails', async () => {
      const newPair = mockTradingPairs[0];
      jest
        .spyOn(repository, 'addTradingPair')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.addTradingPair(newPair)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateTradingPair', () => {
    it('should update trading pair successfully', async () => {
      const pairId = 'pair-1';
      const updateData = { symbol: 'updated-symbol' };
      jest
        .spyOn(repository, 'updateTradingPair')
        .mockResolvedValue({ affected: 1 } as any);

      await service.updateTradingPair(pairId, updateData);
      expect(repository.updateTradingPair).toHaveBeenCalledWith(
        pairId,
        updateData,
      );
    });

    it('should throw error when updating trading pair fails', async () => {
      const pairId = 'pair-1';
      const updateData = { symbol: 'updated-symbol' };
      jest
        .spyOn(repository, 'updateTradingPair')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateTradingPair(pairId, updateData),
      ).rejects.toThrow('Database error');
    });
  });

  describe('removeTradingPair', () => {
    it('should remove trading pair successfully', async () => {
      const pairId = 'pair-1';
      jest
        .spyOn(repository, 'removeTradingPair')
        .mockResolvedValue({ affected: 1 } as any);

      await service.removeTradingPair(pairId);
      expect(repository.removeTradingPair).toHaveBeenCalledWith(pairId);
    });

    it('should throw error when removing trading pair fails', async () => {
      const pairId = 'pair-1';
      jest
        .spyOn(repository, 'removeTradingPair')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.removeTradingPair(pairId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
