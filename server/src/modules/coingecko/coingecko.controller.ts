// coingecko.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CoinFullInfo,
  CoinMarket,
  CoinMarketChartResponse,
} from 'coingecko-api-v3';

@ApiTags('marketdata')
@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoProxy: CoingeckoProxyService) {}

  @Get('/coins/:id')
  async getCoinsById(@Param('id') id: string): Promise<CoinFullInfo> {
    return this.coingeckoProxy.coinsId(id);
  }

  @Get('/coins/markets/:vs_currency')
  async getCoinMarkets(
    @Param('vs_currency') vs_currency = 'usd',
  ): Promise<CoinMarket[]> {
    return this.coingeckoProxy.coinsMarkets(vs_currency);
  }

  @Get('/coins/markets/:vs_currency/category/:category')
  async getCoinMarketsByCategory(
    @Param('vs_currency') vs_currency = 'usd',
    @Param('category')
    category: 'decentralized_finance_defi' | 'stablecoins' | 'all',
  ): Promise<any> {
    return this.coingeckoProxy.coinsMarkets(
      vs_currency,
      category === 'all' ? undefined : category,
    );
  }

  @Get('/coins/:id/market_chart')
  async getCoinIdMarketChart(
    @Param('id') id: string,
    @Query('days') days: number | 'max',
    @Query('vs_currency') vs_currency = 'usd',
  ): Promise<CoinMarketChartResponse> {
    return this.coingeckoProxy.coinsIdMarketChart(id, days, vs_currency);
  }

  @Get('/coins/:id/market_chart/range')
  async getCoinIdMarketRange(
    @Param('id') id: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('vs_currency') vs_currency = 'usd',
  ): Promise<CoinMarketChartResponse> {
    return this.coingeckoProxy.coinIdMarketChartRange(
      id,
      from,
      to,
      vs_currency,
    );
  }
}
