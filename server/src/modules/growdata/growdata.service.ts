import { Cache } from 'cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GrowdataRepository } from 'src/modules/growdata/growdata.repository';
import { GrowdataMarketMakingPair } from 'src/common/entities/grow-data.entity';
import { MIXIN_API_BASE_URL } from 'src/common/constants/constants';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class GrowdataService {
  private readonly logger = new CustomLogger(GrowdataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly growdataRepository: GrowdataRepository,
  ) {}

  private cachingTTL = 600; // 10 minutes

  async getGrowData() {
    try {
      const simplyGrowTokens = await this.getAllSimplyGrowTokens();
      const arbitragePairs = await this.getAllArbitragePairs();
      const marketMakingPairs = await this.getAllMarketMakingPairs();

      return {
        simply_grow: {
          tokens: simplyGrowTokens,
        },
        arbitrage: {
          pairs: arbitragePairs,
        },
        market_making: {
          pairs: marketMakingPairs,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching grow data', error.stack);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: error.message,
      };
    }
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

    for (const pair of pairs) {
      const baseAssetPrice = await this.fetchExternalPriceData(
        pair.base_asset_id,
      );
      pair.base_price = baseAssetPrice;
      const targetAssetPrice = await this.fetchExternalPriceData(
        pair.target_asset_id,
      );
      pair.target_price = targetAssetPrice;
    }
    return pairs;
  }

  async getArbitragePairById(id: string) {
    return this.growdataRepository.findArbitragePairById(id);
  }

  // MarketMakingPair Methods
  async getAllMarketMakingPairs() {
    const pairs = await this.growdataRepository.findAllMarketMakingPairs();
    for (const pair of pairs) {
      const baseAssetPrice = await this.fetchExternalPriceData(
        pair.base_asset_id,
      );
      pair.base_price = baseAssetPrice;
      const targetAssetPrice = await this.fetchExternalPriceData(
        pair.target_asset_id,
      );
      pair.target_price = targetAssetPrice;
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

  private async fetchExternalPriceData(asset_id: string) {
    const cacheKey = `growdata-${asset_id}-price`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${MIXIN_API_BASE_URL}/network/assets/${asset_id}`,
    );
    const data = await response.json();
    const price_usd = data.data.price_usd;
    if (price_usd) {
      await this.cacheService.set(cacheKey, price_usd, this.cachingTTL);
    }
    return price_usd || '0';
  }
}
