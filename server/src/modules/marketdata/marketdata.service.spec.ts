// marketdata.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MarketdataService } from './marketdata.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as ccxt from 'ccxt';
import { CustomLogger } from '../logger/logger.service';


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
      fetchOHLCV:mockFetchOHLCV,
      has: { fetchTickers: true, fetchOHLCV: true },
      name: 'binance',
    })),
    mexc: jest.fn(() => ({
      // Mock other exchanges 
    })),
    bitfinex: jest.fn(() => ({
      // ...
    })),
  },
}));

describe('MarketdataService', () => {
  let service: MarketdataService;
  let cacheManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketdataService,
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
        CustomLogger,
      ],
    }).compile();

    service = module.get<MarketdataService>(MarketdataService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTickers', () => {
    it('fetches tickers successfully from a supported exchange', async () => {
      const expectedTickers = { BTCUSD: { last: 50000 } };
      mockFetchTickers.mockResolvedValue(expectedTickers);
  
      const tickers = await service.getTickers('binance', ['BTCUSD']);
      expect(tickers).toEqual(expectedTickers);
      expect(mockFetchTickers).toHaveBeenCalledWith(['BTCUSD']);
    });  
    
    it('throws an error when fetchTickers fails', async () => {
      mockFetchTickers.mockRejectedValue(new Error('API call failed'));
  
      await expect(service.getTickers('binance', ['BTCUSD'])).rejects.toThrow('API call failed');
    });
  
  });

  describe('getOHLCVData', () => {
    it('fetches OHLCV data successfully', async () => {
      const expectedOHLCV = [[1609459200000, 29000, 29500, 28500, 29300, 1200]];
      mockFetchOHLCV.mockResolvedValue(expectedOHLCV);
  
      const OHLCV = await service.getOHLCVData('binance', 'BTCUSD');
      expect(OHLCV).toEqual(expectedOHLCV.map((data) => ({
        timestamp: data[0],
        open: data[1],
        close: data[2],
        high: data[3],
        low: data[4],
        volume: data[5],
      })));
      expect(mockFetchOHLCV).toHaveBeenCalledWith('BTCUSD', '1m', undefined, 30);
    });

  
    // Add more tests , unsupported exchanges, different timeframes, etc.
  });
  describe('getSupportedPairs', () => {
    it('returns supported pairs from cache if available', async () => {
      const cachedPairs = [{ symbol: 'BTCUSD', price: 50000 }];
      cacheManager.get.mockResolvedValue(JSON.stringify(cachedPairs));
  
      const pairs = await service.getSupportedPairs();
      expect(pairs).toEqual(cachedPairs);
      expect(cacheManager.get).toHaveBeenCalledWith('supported-pairs');
    });

    // Add tests for error handling, etc.
  });


  

});
