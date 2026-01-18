import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MixinClientService } from 'src/modules/mixin/client/mixin-client.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { GrowdataRepository } from 'src/modules/data/grow-data/grow-data.repository';
import { GrowdataMarketMakingPair } from 'src/common/entities/grow-data.entity';

@Injectable()
export class GrowdataService {
  private readonly logger = new CustomLogger(GrowdataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly growdataRepository: GrowdataRepository,
    private readonly mixinClientService: MixinClientService,
  ) { }

  private cachingTTL = 60; // 1 minute

  async getGrowData() {
    try {
      const exchanges = await this.getAllExchanges();
      const simplyGrowTokens = await this.getAllSimplyGrowTokens();
      const arbitragePairs = await this.getAllArbitragePairs();
      const marketMakingPairs = await this.getAllMarketMakingPairs();

      return {
        exchanges,
        simply_grow: {
          tokens: simplyGrowTokens,
        },
        arbitrage: {
          pairs: arbitragePairs,
        },
        market_making: {
          pairs: marketMakingPairs,
          exchanges: exchanges.filter((exchange) =>
            marketMakingPairs.some(
              (pair) => pair.exchange_id === exchange.exchange_id,
            ),
          ),
        },
      };
    } catch (error) {
      this.logger.error('Error fetching grow data', error.stack);
      return {
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  // Exchange Methods
  async getAllExchanges() {
    return this.growdataRepository.findAllExchanges();
  }

  async getExchangeById(exchange_id: string) {
    return this.growdataRepository.findExchangeById(exchange_id);
  }

  // SimplyGrowToken Methods
  async getAllSimplyGrowTokens() {
    return this.growdataRepository.findAllSimplyGrowTokens();
  }

  async getSimplyGrowTokenById(asset_id: string) {
    return this.growdataRepository.findSimplyGrowTokenById(asset_id);
  }

  // ArbitragePair Methods
  async getAllArbitragePairs() {
    const pairs = await this.growdataRepository.findAllArbitragePairs();

    const assetIds = pairs.flatMap((pair) => [
      pair.base_asset_id,
      pair.quote_asset_id,
    ]);
    const priceMap = await this.fetchExternalPriceData(assetIds);

    for (const pair of pairs) {
      pair.base_price = priceMap.get(pair.base_asset_id) || '0';
      pair.target_price = priceMap.get(pair.quote_asset_id) || '0';
    }
    return pairs;
  }

  async getArbitragePairById(id: string) {
    return this.growdataRepository.findArbitragePairById(id);
  }

  // MarketMakingPair Methods
  async getAllMarketMakingPairs() {
    const pairs = await this.growdataRepository.findAllMarketMakingPairs();
    this.logger.debug(`MarketMakingPairs: ${JSON.stringify(pairs)}`);

    const assetIds = pairs.flatMap((pair) => [
      pair.base_asset_id,
      pair.quote_asset_id,
    ]);
    const priceMap = await this.fetchExternalPriceData(assetIds);

    for (const pair of pairs) {
      pair.base_price = priceMap.get(pair.base_asset_id) || '0';
      pair.target_price = priceMap.get(pair.quote_asset_id) || '0';
    }
    return pairs;
  }

  async getMarketMakingPairById(id: string) {
    return this.growdataRepository.findMarketMakingPairById(id);
  }

  async removeMarketMakingPair(id: string) {
    return this.growdataRepository.removeMarketMakingPair(id);
  }

  async updateMarketMakingPair(
    id: string,
    modifications: Partial<GrowdataMarketMakingPair>,
  ) {
    try {
      await this.growdataRepository.updateMarketMakingPair(id, modifications);
    } catch (error) {
      this.logger.error(
        `Failed to modify market making pair with ID ${id}`,
        error,
      );
    }
  }

  private async fetchExternalPriceData(asset_ids: string[]) {
    const uniqueAssetIds = [...new Set(asset_ids.filter((id) => !!id))];
    if (uniqueAssetIds.length === 0) return new Map<string, string>();

    const priceMap = new Map<string, string>();
    const missingAssetIds: string[] = [];

    for (const assetId of uniqueAssetIds) {
      const cacheKey = `asset_price_${assetId}`;
      const cachedPrice = await this.cacheService.get<string>(cacheKey);
      if (cachedPrice) {
        priceMap.set(assetId, cachedPrice);
      } else {
        missingAssetIds.push(assetId);
      }
    }

    if (missingAssetIds.length === 0) {
      return priceMap;
    }

    try {
      const assets = await this.mixinClientService.client.safe.fetchAssets(
        missingAssetIds,
      );
      for (const asset of assets) {
        const price = asset.price_usd || '0';
        priceMap.set(asset.asset_id, price);
        await this.cacheService.set(
          `asset_price_${asset.asset_id}`,
          price,
          this.cachingTTL,
        );
      }
      return priceMap;
    } catch (error) {
      this.logger.error(
        `Failed to fetch prices for assets: ${missingAssetIds.join(', ')}`,
        error.stack,
      );
      return priceMap;
    }
  }
}
