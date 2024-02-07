// coingecko.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoingeckoProxyService } from './coingecko.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('marketdata')
@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoProxy: CoingeckoProxyService) {}

  @Get('/coins/:id')
  async getCoinsById(@Param('id') id: string): Promise<any> {
    return this.coingeckoProxy.coinsId(id);
  }

  @Get('/coins/markets/:vs_currency')
  async getCoinMarkets(@Param('vs_currency') vs_currency: string = 'usd'): Promise<any> {
    return this.coingeckoProxy.coinsMarkets(vs_currency);
  }

  @Get('/coins/:id/market_chart')
  async getCoinIdMarketChart(@Param('id') id: string, @Query('days') days: number | 'max', @Query('vs_currency') vs_currency: string = 'usd') {
    return this.coingeckoProxy.coinsIdMarketChart(id, days, vs_currency)
  }

  @Get('/coins/:id/market_chart/range')
  async getCoinIdMarketRange(@Param('id') id: string, @Query('from') from: number, @Query('to') to: number, @Query('vs_currency') vs_currency: string = 'usd') {
    return this.coingeckoProxy.coinIdMarketChartRange(id, from, to, vs_currency)
  }
}