import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { GrowdataRepository } from 'src/modules/growdata/growdata.repository';
import {
  Exchange,
  SimplyGrowToken,
  ArbitragePair,
  MarketMakingPair,
} from 'src/common/entities/growdata.entity';
import { MIXIN_API_BASE_URL } from 'src/common/constants/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GrowdataService {
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
  async addExchange(exchange: Exchange) {
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

  // SimplyGrowToken Methods
  async addSimplyGrowToken(token: SimplyGrowToken) {
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

  // ArbitragePair Methods
  async addArbitragePair(pair: ArbitragePair) {
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

  async getArbitragePairById(symbol: string) {
    return this.growdataRepository.findArbitragePairById(symbol);
  }

  async removeArbitragePair(symbol: string) {
    return this.growdataRepository.removeArbitragePair(symbol);
  }

  // MarketMakingPair Methods
  async addMarketMakingPair(pair: MarketMakingPair) {
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

  async getMarketMakingPairById(symbol: string) {
    return this.growdataRepository.findMarketMakingPairById(symbol);
  }

  async removeMarketMakingPair(symbol: string) {
    return this.growdataRepository.removeMarketMakingPair(symbol);
  }

  private async fetchExternalPriceData(asset_id: string) {
    const cacheKey = `${asset_id}_price`;
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
