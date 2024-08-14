import { Test, TestingModule } from '@nestjs/testing';
import { MarketdataService } from './marketdata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { CustomLogger } from '../logger/logger.service';

describe('MarketdataService', () => {
  let service: MarketdataService;
  let cacheManager: Cache;
  let exchangeInitService: ExchangeInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketdataService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ExchangeInitService,
          useValue: {
            getSupportedExchanges: jest.fn(),
            getMarketdataInstance: jest.fn(),
          },
        },
        CustomLogger,
      ],
    }).compile();

    service = module.get<MarketdataService>(MarketdataService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    exchangeInitService = module.get<ExchangeInitService>(ExchangeInitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSupportedExchanges', () => {
    it('should return supported exchanges', async () => {
      const mockExchanges = ['binance', 'coinbase', 'kraken'];
      jest
        .spyOn(exchangeInitService, 'getSupportedExchanges')
        .mockResolvedValue(mockExchanges as never);

      const result = await service.getSupportedExchanges();
      expect(result).toEqual(mockExchanges);
      expect(exchangeInitService.getSupportedExchanges).toHaveBeenCalled();
    });
  });

  describe('getTickers', () => {
    it('should fetch tickers from exchange', async () => {
      const exchangeName = 'binance';
      const symbols = ['BTC/USDT'];
      const mockExchange = {
        has: { fetchTickers: true },
        fetchTickers: jest
          .fn()
          .mockResolvedValue({ 'BTC/USDT': { last: 50000 } }),
        name: exchangeName,
      };
      jest
        .spyOn(exchangeInitService, 'getMarketdataInstance')
        .mockReturnValue(mockExchange as any);

      const result = await service.getTickers(exchangeName, symbols);
      expect(result).toEqual({ 'BTC/USDT': { last: 50000 } });
      expect(mockExchange.fetchTickers).toHaveBeenCalledWith(symbols);
    });

    it('should throw an error if exchange does not support fetchTickers', async () => {
      const exchangeName = 'binance';
      const symbols = ['BTC/USDT'];
      const mockExchange = {
        has: { fetchTickers: false },
      };
      jest
        .spyOn(exchangeInitService, 'getMarketdataInstance')
        .mockReturnValue(mockExchange as any);

      await expect(service.getTickers(exchangeName, symbols)).rejects.toThrow(
        'Exchange does not support fetchTickers or is not configured.',
      );
    });
  });

  describe('getOHLCVData', () => {
    it('should fetch OHLCV data from exchange', async () => {
      const exchangeName = 'binance';
      const symbol = 'BTC/USDT';
      const mockExchange = {
        has: { fetchOHLCV: true },
        fetchOHLCV: jest
          .fn()
          .mockResolvedValue([
            [1620000000000, 50000, 51000, 52000, 49000, 100],
          ]),
        name: exchangeName,
      };
      jest
        .spyOn(exchangeInitService, 'getMarketdataInstance')
        .mockReturnValue(mockExchange as any);

      const result = await service.getOHLCVData(exchangeName, symbol);
      expect(result).toEqual([
        {
          timestamp: 1620000000000,
          open: 50000,
          close: 51000,
          high: 52000,
          low: 49000,
          volume: 100,
        },
      ]);
      expect(mockExchange.fetchOHLCV).toHaveBeenCalledWith(
        symbol,
        '1m',
        undefined,
        30,
      );
    });

    it('should throw an error if exchange does not support fetchOHLCV', async () => {
      const exchangeName = 'binance';
      const symbol = 'BTC/USDT';
      const mockExchange = {
        has: { fetchOHLCV: false },
      };
      jest
        .spyOn(exchangeInitService, 'getMarketdataInstance')
        .mockReturnValue(mockExchange as any);

      await expect(service.getOHLCVData(exchangeName, symbol)).rejects.toThrow(
        'Exchange does not support fetchOHLCV or is not configured.',
      );
    });
  });

  describe('getSupportedPairs', () => {
    it('should return cached supported pairs if available', async () => {
      const cachedPairs = [{ symbol: 'BTC/USDT', price: 50000 }];
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(JSON.stringify(cachedPairs));

      const result = await service.getSupportedPairs();
      expect(result).toEqual(cachedPairs);
    });

    it('should fetch and cache supported pairs if not cached', async () => {
      const pairs = [{ symbol: 'BTC/USDT', price: 50000 }];
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(service, '_getSupportedPairs').mockResolvedValue(pairs);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.getSupportedPairs();
      expect(result).toEqual(pairs);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'supported-pairs',
        JSON.stringify(pairs),
        undefined,
      );
    });
  });

  // Add more tests for other methods as needed
});
