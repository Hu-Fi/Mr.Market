// coingecko.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'per_page',
    description: 'Number of items per page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
  })
  async getCoinMarkets(
    @Param('vs_currency') vs_currency = 'usd',
    @Query('per_page') per_page: number,
    @Query('page') page: number,
  ): Promise<CoinMarket[]> {
    return this.coingeckoProxy.coinsMarkets(
      vs_currency,
      undefined,
      per_page,
      page,
    );
  }

  @Get('/coins/markets/:vs_currency/category/:category')
  @ApiQuery({
    name: 'per_page',
    description: 'Number of items per page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
  })
  async getCoinMarketsByCategory(
    @Param('vs_currency') vs_currency = 'usd',
    @Param('category')
    category: 'decentralized_finance_defi' | 'stablecoins' | 'all',
    @Query('per_page') per_page: number,
    @Query('page') page: number,
  ): Promise<any> {
    return this.coingeckoProxy.coinsMarkets(
      vs_currency,
      category === 'all' ? undefined : category,
      per_page,
      page,
    );
  }

  @Get('/coins/:id/market_chart')
  @ApiQuery({
    name: 'days',
    description: 'Number of days to get data for',
    required: true,
  })
  @ApiQuery({
    name: 'vs_currency',
    description: 'Currency to get data in',
    required: false,
  })
  async getCoinIdMarketChart(
    @Param('id') id: string,
    @Query('days') days: number | 'max',
    @Query('vs_currency') vs_currency: string,
  ): Promise<CoinMarketChartResponse> {
    return this.coingeckoProxy.coinsIdMarketChart(id, days, vs_currency);
  }

  @Get('/coins/:id/market_chart/range')
  @ApiQuery({
    name: 'from',
    description: 'Start date',
    required: true,
  })
  @ApiQuery({
    name: 'to',
    description: 'End date',
    required: true,
  })
  @ApiQuery({
    name: 'vs_currency',
    description: 'Currency to get data in',
    required: false,
  })
  async getCoinIdMarketRange(
    @Param('id') id: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('vs_currency') vs_currency: string,
  ): Promise<CoinMarketChartResponse> {
    return this.coingeckoProxy.coinIdMarketChartRange(
      id,
      from,
      to,
      vs_currency,
    );
  }
}
