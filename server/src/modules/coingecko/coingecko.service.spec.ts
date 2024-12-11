import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoProxyService } from './coingecko.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CoinGeckoClient } from 'coingecko-api-v3';

jest.mock('coingecko-api-v3', () => ({
  CoinGeckoClient: jest.fn().mockImplementation(() => ({
    coinId: jest.fn(),
    coinMarket: jest.fn(),
    coinIdMarketChart: jest.fn(),
    coinIdMarketChartRange: jest.fn(),
  })),
}));

describe('CoingeckoProxyService', () => {
  let service: CoingeckoProxyService;
  let cacheManagerMock: any;
  let coinGeckoClientMock: CoinGeckoClient;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoingeckoProxyService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<CoingeckoProxyService>(CoingeckoProxyService);
    coinGeckoClientMock = new CoinGeckoClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test cases will be added here

  describe('coinsId', () => {
    it('should return cached data if available', async () => {
      const mockId = 'bitcoin';
      const mockData = { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' };
      cacheManagerMock.get.mockResolvedValue(mockData);

      const result = await service.coinsId(mockId);
      expect(result).toEqual(mockData);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(mockId);
      expect(coinGeckoClientMock.coinId).not.toHaveBeenCalled();
    });

    // Add more tests for error handling and edge cases
  });
  describe('coinsMarkets', () => {
    const mockVsCurrency = 'usd';
    const mockPage = 1;
    const mockPerPage = 250;
    const mockData = [{ id: 'bitcoin', symbol: 'btc', current_price: 50000 }];

    it('should return cached market data if available', async () => {
      const key = `markets/${mockVsCurrency}/${mockPerPage}/${mockPage}`;
      cacheManagerMock.get.mockResolvedValue(mockData);

      const result = await service.coinsMarkets(
        mockVsCurrency,
        undefined,
        mockPerPage,
        mockPage,
      );
      expect(result).toEqual(mockData);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(key);
      expect(coinGeckoClientMock.coinMarket).not.toHaveBeenCalled();
    });

    // Consider adding tests for error handling if the CoinGecko API call fails
  });
  describe('coinsIdMarketChart', () => {
    const mockId = 'bitcoin';
    const mockDays = 1;
    const mockVsCurrency = 'usd';
    const mockData = { prices: [[1625097600000, 34607.406]] }; // Example data format from CoinGecko API

    it('should return cached chart data if available', async () => {
      const key = `chart/${mockId}-${mockDays}-${mockVsCurrency}`;
      cacheManagerMock.get.mockResolvedValue(mockData);

      const result = await service.coinsIdMarketChart(
        mockId,
        mockDays,
        mockVsCurrency,
      );
      expect(result).toEqual(mockData);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(key);
      expect(coinGeckoClientMock.coinIdMarketChart).not.toHaveBeenCalled();
    });
  });

  describe('coinIdMarketChartRange', () => {
    const mockId = 'ethereum';
    const mockFrom = 1625097600; // Example UNIX timestamp
    const mockTo = 1625184000; // Example UNIX timestamp
    const mockVsCurrency = 'usd';
    const mockData = { prices: [[1625097600000, 2000.0]] }; // Example data format from CoinGecko API

    it('should return cached chart range data if available', async () => {
      const key = `chart/${mockId}-${mockFrom}-${mockTo}-${mockVsCurrency}`;
      cacheManagerMock.get.mockResolvedValue(mockData);

      const result = await service.coinIdMarketChartRange(
        mockId,
        mockFrom,
        mockTo,
        mockVsCurrency,
      );
      expect(result).toEqual(mockData);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(key);
      expect(coinGeckoClientMock.coinIdMarketChartRange).not.toHaveBeenCalled();
    });
  });
});
