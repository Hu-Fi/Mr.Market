// coingecko.service.ts
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import {
  CoinFullInfo,
  CoinGeckoClient,
  CoinMarket,
  CoinMarketChartResponse,
} from 'coingecko-api-v3';

@Injectable()
export class CoingeckoProxyService {
  private coingecko: CoinGeckoClient;
  private cachingTTL: 30; // 30s

  // Using caching to avoid coingecko rate limit (30 calls/min)
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
    this.coingecko = new CoinGeckoClient(
      {
        timeout: 5000,
        autoRetry: false,
      },
      process.env.COINGECKO_API_KEY,
    );
  }

  // /coins/{id}
  async coinsId(id: string): Promise<CoinFullInfo> {
    try {
      const cachedData = await this.cacheService.get(id);
      if (!cachedData) {
        const data = await this.coingecko.coinId({ id });
        await this.cacheService.set(id, data, this.cachingTTL);
        return data;
      }
      return cachedData;
    } catch (error) {
      throw new Error(`Failed to GET /coins/id: ${error.message}`);
    }
  }

  // /coins/markets
  async coinsMarkets(
    vs_currency = 'usd',
    category?: 'decentralized_finance_defi' | 'stablecoins',
    per_page = 500,
  ): Promise<CoinMarket[]> {
    try {
      const key = `markets/${vs_currency}${category ? `/${category}` : ''}`;
      const cachedData = await this.cacheService.get<CoinMarket[]>(key);
      if (!cachedData) {
        const data = await this.coingecko.coinMarket(
          category
            ? {
                vs_currency: vs_currency,
                per_page,
                category,
              }
            : { vs_currency: vs_currency, per_page },
        );
        await this.cacheService.set(key, data, this.cachingTTL);
        return data;
      }
      return cachedData;
    } catch (error) {
      throw new Error(
        `markets/${vs_currency} Failed to GET /coins/market: ${error.message}`,
      );
    }
  }

  // /coins/{id}/market_chart
  async coinsIdMarketChart(
    id: string,
    days: number | 'max' = 1,
    vs_currency = 'usd',
  ): Promise<CoinMarketChartResponse> {
    try {
      const key = `chart/${id}-${days}-${vs_currency}`;
      const cachedData = await this.cacheService.get<CoinMarketChartResponse>(
        key,
      );
      if (!cachedData) {
        const data = await this.coingecko.coinIdMarketChart({
          id,
          vs_currency,
          days,
        });
        await this.cacheService.set(key, data, this.cachingTTL * 2);
        return data;
      }
      return cachedData;
    } catch (error) {
      throw new Error(
        `Failed to GET /coins/{$id}/market_chart: ${error.message}`,
      );
    }
  }

  // /coins/{id}/market_chart/range
  async coinIdMarketChartRange(
    id: string,
    from: number,
    to: number,
    vs_currency: string,
  ) {
    try {
      const key = `chart/${id}-${from}-${to}-${vs_currency}`;
      const cachedData = await this.cacheService.get(key);
      if (!cachedData) {
        const data = await this.coingecko.coinIdMarketChartRange({
          id,
          vs_currency,
          from,
          to,
        });
        await this.cacheService.set(key, data, this.cachingTTL);
        return data;
      }
      return cachedData;
    } catch (error) {
      throw new Error(
        `Failed to GET /coins/{id}/market_chart/range: ${error.message}`,
      );
    }
  }
}
