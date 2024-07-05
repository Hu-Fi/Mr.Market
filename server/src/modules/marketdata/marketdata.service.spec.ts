import { Test, TestingModule } from '@nestjs/testing';
import { MarketdataService } from './marketdata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomLogger } from '../logger/logger.service';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';

jest.mock('../logger/logger.service');

const mockCacheManager = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

// Mock setup for ccxt
const mockFetchTickers = jest.fn();
const mockFetchOHLCV = jest.fn();
jest.mock('ccxt', () => ({
  pro: {
    binance: jest.fn(() => ({
      fetchTickers: mockFetchTickers,
      fetchOHLCV: mockFetchOHLCV,
      has: { fetchTickers: true, fetchOHLCV: true },
      name: 'binance',
    })),
    mexc: jest.fn(() => ({
      // Mock other exchanges
    })),
    bitfinex: jest.fn(() => ({
      // ...
    })),
    okx: jest.fn(() => ({})),
    gateio: jest.fn(() => ({})),
    lbank: jest.fn(() => ({})),
  },
}));

const mockExchangeInitService = () => ({
  getExchange: jest.fn(),
  getSupportedExchanges: jest.fn(),
});

describe('MarketdataService', () => {
  let service: MarketdataService;
  let cacheManager;
  let exchangeInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketdataService,
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
        { provide: ExchangeInitService, useFactory: mockExchangeInitService },
        CustomLogger,
      ],
    }).compile();

    service = module.get<MarketdataService>(MarketdataService);
    cacheManager = module.get(CACHE_MANAGER);
    exchangeInitService = module.get<ExchangeInitService>(ExchangeInitService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTickers', () => {
    it('fetches tickers successfully from a supported exchange', async () => {
      const expectedTickers = { BTCUSD: { last: 50000 } };
      mockFetchTickers.mockResolvedValue(expectedTickers);
      exchangeInitService.getExchange.mockReturnValue({
        fetchTickers: mockFetchTickers,
        has: { fetchTickers: true },
        name: 'binance',
      });

      const tickers = await service.getTickers('binance', ['BTCUSD']);
      expect(tickers).toEqual(expectedTickers);
      expect(mockFetchTickers).toHaveBeenCalledWith(['BTCUSD']);
    });

    it('throws an error when fetchTickers fails', async () => {
      mockFetchTickers.mockRejectedValue(new Error('API call failed'));
      exchangeInitService.getExchange.mockReturnValue({
        fetchTickers: mockFetchTickers,
        has: { fetchTickers: true },
        name: 'binance',
      });

      await expect(service.getTickers('binance', ['BTCUSD'])).rejects.toThrow(
        'API call failed',
      );
    });
  });

  describe('getOHLCVData', () => {
    it('fetches OHLCV data successfully', async () => {
      const expectedOHLCV = [[1609459200000, 29000, 29500, 28500, 29300, 1200]];
      mockFetchOHLCV.mockResolvedValue(expectedOHLCV);
      exchangeInitService.getExchange.mockReturnValue({
        fetchOHLCV: mockFetchOHLCV,
        has: { fetchOHLCV: true },
        name: 'binance',
      });

      const OHLCV = await service.getOHLCVData('binance', 'BTCUSD');
      expect(OHLCV).toEqual(
        expectedOHLCV.map((data) => ({
          timestamp: data[0],
          open: data[1],
          close: data[2],
          high: data[3],
          low: data[4],
          volume: data[5],
        })),
      );
      expect(mockFetchOHLCV).toHaveBeenCalledWith(
        'BTCUSD',
        '1m',
        undefined,
        30,
      );
    });
  });

  describe('getSupportedPairs', () => {
    it('returns supported pairs from cache if available', async () => {
      const cachedPairs = [{ symbol: 'BTCUSD', price: 50000 }];
      cacheManager.get.mockResolvedValue(JSON.stringify(cachedPairs));

      const pairs = await service.getSupportedPairs();
      expect(pairs).toEqual(cachedPairs);
      expect(cacheManager.get).toHaveBeenCalledWith('supported-pairs');
    });
  });
});
