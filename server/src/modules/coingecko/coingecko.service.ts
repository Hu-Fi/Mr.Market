/**
 * CoingeckoProxyService
 *
 * This service acts as a proxy for interacting with the CoinGecko API, providing
 * methods to fetch various cryptocurrency data while implementing caching to
 * minimize API rate limit issues.
 *
 * Dependencies:
 * - Cache: NestJS cache manager for caching API responses.
 * - CoinGeckoClient: Client from the CoinGecko API v3 package for making requests to CoinGecko.
 *
 * Caching:
 * - cachingTTL: Time-to-live for cached data (30 seconds).
 * - The service uses caching to store responses and reduce the number of API calls to CoinGecko.
 *
 * Methods:
 * - constructor: Initializes the CoinGecko client and configures caching.
 * - coinsId(id: string): Fetches detailed information about a specific coin by its ID.
 * - coinsMarkets(vs_currency: string, category?: string, per_page?: number):
 *   Fetches market data for coins, with optional filtering by category.
 * - coinsIdMarketChart(id: string, days: number | 'max', vs_currency: string):
 *   Fetches market chart data for a specific coin over a specified time range.
 * - coinIdMarketChartRange(id: string, from: number, to: number, vs_currency: string):
 *   Fetches market chart data for a specific coin within a date range.
 *
 * Error Handling:
 * - Each method includes error handling to catch and throw errors with descriptive messages.
 *
 * Notes:
 * - This service is designed to efficiently handle CoinGecko API interactions with built-in
 *   caching to manage rate limits and improve performance.
 */

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
    category?: 'decentralized_finance_defi' | 'stablecoins' | undefined,
    per_page = 250,
    page = 1,
  ): Promise<CoinMarket[]> {
    try {
      const key = `markets/${vs_currency}${
        category ? `/${category}` : '/'
      }${per_page}/${page}`;
      const cachedData = await this.cacheService.get<CoinMarket[]>(key);
      if (!cachedData) {
        const data = await this.coingecko.coinMarket(
          category
            ? {
                vs_currency: vs_currency,
                per_page,
                page,
                category,
              }
            : { vs_currency, per_page, page },
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
    vs_currency: string = 'usd',
  ): Promise<CoinMarketChartResponse> {
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
