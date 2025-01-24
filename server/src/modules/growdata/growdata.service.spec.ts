import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GrowdataService } from './growdata.service';
import { GrowdataRepository } from './growdata.repository';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../logger/logger.service';

describe('GrowdataService', () => {
  let service: GrowdataService;
  let repository: GrowdataRepository;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrowdataService,
        {
          provide: GrowdataRepository,
          useValue: {
            addExchange: jest.fn(),
            findAllExchanges: jest.fn(),
            removeExchange: jest.fn(),
            addSimplyGrowToken: jest.fn(),
            findAllSimplyGrowTokens: jest.fn(),
            findSimplyGrowTokenById: jest.fn(),
            removeSimplyGrowToken: jest.fn(),
            addArbitragePair: jest.fn(),
            findAllArbitragePairs: jest.fn(),
            findArbitragePairById: jest.fn(),
            removeArbitragePair: jest.fn(),
            addMarketMakingPair: jest.fn(),
            findAllMarketMakingPairs: jest.fn(),
            findMarketMakingPairById: jest.fn(),
            removeMarketMakingPair: jest.fn(),
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
          },
        },
      ],
    }).compile();

    service = module.get<GrowdataService>(GrowdataService);
    repository = module.get<GrowdataRepository>(GrowdataRepository);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGrowData', () => {
    it('should return grow data', async () => {
      jest.spyOn(repository, 'findAllSimplyGrowTokens').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllArbitragePairs').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllMarketMakingPairs').mockResolvedValue([]);

      const result = await service.getGrowData();
      expect(result).toEqual({
        simply_grow: { tokens: [] },
        arbitrage: { pairs: [] },
        market_making: { pairs: [] },
      });
    });
  });

  describe('fetchExternalPriceData', () => {
    it('should fetch and cache external price data when cache is empty', async () => {
      const assetId = 'test-asset-id';
      const price_usd = '100';
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue({ data: { price_usd } }),
      } as any);
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(cacheService, 'set').mockResolvedValue(null);

      const result = await service['fetchExternalPriceData'](assetId);
      expect(result).toEqual(price_usd);
      expect(cacheService.set).toHaveBeenCalledWith(
        `growdata-${assetId}-price`,
        price_usd,
        service['cachingTTL'],
      );
    });

    it('should return cached price data when cache has value', async () => {
      const assetId = 'test-asset-id';
      const cachedPriceData = '100';
      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedPriceData);

      const result = await service['fetchExternalPriceData'](assetId);
      expect(result).toEqual(cachedPriceData);
      expect(cacheService.set).not.toHaveBeenCalled();
    });
  });
});
