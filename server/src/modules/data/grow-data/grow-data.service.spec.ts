import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GrowdataService } from './grow-data.service';
import { GrowdataRepository } from './grow-data.repository';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../../infrastructure/logger/logger.service';

describe('GrowdataService', () => {
  let service: GrowdataService;
  let repository: GrowdataRepository;
  let cacheService: Cache;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GrowdataService,
        {
          provide: 'MixinClientService',
          useValue: {
            client: {
              safe: {
                fetchAssets: jest.fn(),
              },
            },
          },
        },
        {
          provide: GrowdataRepository,
          useValue: {
            addExchange: jest.fn(),
            findAllExchanges: jest.fn(),
            findExchangeById: jest.fn(),
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
            debug: jest.fn(),
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
      jest.spyOn(repository, 'findAllExchanges').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllSimplyGrowTokens').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllArbitragePairs').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllMarketMakingPairs').mockResolvedValue([]);

      const result = await service.getGrowData();
      expect(result).toEqual({
        exchanges: [],
        simply_grow: { tokens: [] },
        arbitrage: { pairs: [] },
        market_making: { pairs: [], exchanges: [] },
      });
    });

    it('should filter exchanges in market_making based on pairs', async () => {
      const exchanges = [
        { exchange_id: 'exchange-1', name: 'Exchange 1' },
        { exchange_id: 'exchange-2', name: 'Exchange 2' },
      ];
      const marketMakingPairs = [{ id: 'pair-1', exchange_id: 'exchange-1' }];

      jest
        .spyOn(repository, 'findAllExchanges')
        .mockResolvedValue(exchanges as any);
      jest.spyOn(repository, 'findAllSimplyGrowTokens').mockResolvedValue([]);
      jest.spyOn(repository, 'findAllArbitragePairs').mockResolvedValue([]);
      // Mock the service method directly to avoid price fetching logic which is not relevant for this test
      jest
        .spyOn(service, 'getAllMarketMakingPairs')
        .mockResolvedValue(marketMakingPairs as any);

      const result = await service.getGrowData();
      expect(result.market_making.exchanges).toHaveLength(1);
      expect(result.market_making.exchanges[0].exchange_id).toBe('exchange-1');
    });
  });

  describe('fetchExternalPriceData', () => {
    it('should fetch external price data in batch', async () => {
      const assetIds = ['asset-1', 'asset-2'];
      const assets = [
        { asset_id: 'asset-1', price_usd: '100' },
        { asset_id: 'asset-2', price_usd: '200' },
      ];
      const mixinClientService = module.get('MixinClientService') as any;
      mixinClientService.client.safe.fetchAssets.mockResolvedValue(assets);

      const result = await (service as any).fetchExternalPriceData(assetIds);
      expect(result).toBeInstanceOf(Map);
      expect(result.get('asset-1')).toEqual('100');
      expect(result.get('asset-2')).toEqual('200');
    });

    it('should return empty map if no asset IDs provided', async () => {
      const result = await (service as any).fetchExternalPriceData([]);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should return empty map and log error on failure', async () => {
      const mixinClientService = module.get('MixinClientService') as any;
      mixinClientService.client.safe.fetchAssets.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await (service as any).fetchExternalPriceData(['asset-1']);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });
  });
});
