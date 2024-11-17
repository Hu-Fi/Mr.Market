import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { GrowdataRepository } from 'src/modules/growdata/growdata.repository';
import {
  GrowdataExchange,
  GrowdataSimplyGrowToken,
  GrowdataArbitragePair,
  GrowdataMarketMakingPair,
} from 'src/common/entities/growdata.entity';
import { MIXIN_API_BASE_URL } from 'src/common/constants/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class GrowdataService {
  private readonly logger = new CustomLogger(GrowdataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly growdataRepository: GrowdataRepository,
  ) {}

  private cachingTTL = 600; // 10 minutes

  async getGrowData() {
    return {
      exchanges: await this.getAllExchanges(),
      simply_grow: {
        tokens: await this.getAllSimplyGrowTokens(),
      },
      arbitrage: {
        pairs: await this.getAllArbitragePairs(),
      },
      market_making: {
        pairs: await this.getAllMarketMakingPairs(),
      },
    };
  }

  // Exchange Methods
  async addExchange(exchange: GrowdataExchange) {
    return this.growdataRepository.addExchange(exchange);
  }

  async getAllExchanges() {
    return this.growdataRepository.findAllExchanges();
  }

  async getExchangeById(exchange_id: string) {
    return this.growdataRepository.findExchangeById(exchange_id);
  }

  async removeExchange(exchange_id: string) {
    return this.growdataRepository.removeExchange(exchange_id);
  }

  async updateExchange(
    exchange_id: string,
    modifications: Partial<GrowdataExchange>,
  ) {
    try {
      await this.growdataRepository.updateExchange(exchange_id, modifications);
    } catch (error) {
      this.logger.error(
        `Failed to modify exchange with ID ${exchange_id}`,
        error,
      );
      throw error;
    }
  }

  // SimplyGrowToken Methods
  async addSimplyGrowToken(token: GrowdataSimplyGrowToken) {
    return this.growdataRepository.addSimplyGrowToken(token);
  }

  async getAllSimplyGrowTokens() {
    return this.growdataRepository.findAllSimplyGrowTokens();
  }

  async getSimplyGrowTokenById(asset_id: string) {
    return this.growdataRepository.findSimplyGrowTokenById(asset_id);
  }

  async removeSimplyGrowToken(asset_id: string) {
    return this.growdataRepository.removeSimplyGrowToken(asset_id);
  }

  async updateSimplyGrowToken(
    asset_id: string,
    modifications: Partial<GrowdataSimplyGrowToken>,
  ) {
    try {
      await this.growdataRepository.updateSimplyGrowToken(
        asset_id,
        modifications,
      );
    } catch (error) {
      this.logger.error(
        `Failed to modify simply grow token with ID ${asset_id}`,
        error,
      );
    }
  }

  // ArbitragePair Methods
  async addArbitragePair(pair: GrowdataArbitragePair) {
    return this.growdataRepository.addArbitragePair(pair);
  }

  async getAllArbitragePairs() {
    const pairs = await this.growdataRepository.findAllArbitragePairs();
    for (const pair of pairs) {
      const externalData = await this.fetchExternalPriceData(pair.symbol);
      pair.base_price = externalData.base_price;
      pair.target_price = externalData.target_price;
    }
    return pairs;
  }

  async getArbitragePairById(id: string) {
    return this.growdataRepository.findArbitragePairById(id);
  }

  async removeArbitragePair(id: string) {
    return this.growdataRepository.removeArbitragePair(id);
  }

  async updateArbitragePair(
    id: string,
    modifications: Partial<GrowdataArbitragePair>,
  ) {
    try {
      await this.growdataRepository.updateArbitragePair(id, modifications);
    } catch (error) {
      this.logger.error(`Failed to modify arbitrage pair with ID ${id}`, error);
    }
  }

  // MarketMakingPair Methods
  async addMarketMakingPair(pair: GrowdataMarketMakingPair) {
    return this.growdataRepository.addMarketMakingPair(pair);
  }

  async getAllMarketMakingPairs() {
    const pairs = await this.growdataRepository.findAllMarketMakingPairs();
    for (const pair of pairs) {
      const externalData = await this.fetchExternalPriceData(pair.symbol);
      pair.base_price = externalData.base_price;
      pair.target_price = externalData.target_price;
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
