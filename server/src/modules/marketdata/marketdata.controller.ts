// market-data.controller.ts
import { Controller,Body, Get, Post, Query } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TickersDto } from './marketdata.dto';



@ApiTags('marketdata')
@Controller('marketdata')
export class MarketDataController {
  constructor(private marketDataService: MarketdataService) {}

  @Get('/ohlcv')
  @ApiOperation({ summary: 'Get OHLCV data' })
  @ApiQuery({ name: 'exchange', description: 'Exchange name', required: true })
  @ApiQuery({ name: 'symbol', description: 'Symbol to get data for', required: true })
  @ApiQuery({ name: 'timeframe', description: 'Timeframe for OHLCV data', required: false })
  @ApiQuery({ name: 'since', description: 'Timestamp to get data since', required: false })
  @ApiQuery({ name: 'limit', description: 'Limit of data points', required: false })
  @ApiResponse({ status: 200, description: 'OHLCV data' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getOHLCV(
    @Query('exchange') exchange: string,
    @Query('symbol') symbol: string,
    @Query('timeframe') timeframe: string,
    @Query('since') since: string,  
    @Query('limit') limit: string,  
  ) {
    const sinceNumber = since ? Number(since) : undefined;
    const limitNumber = limit ? Number(limit) : 30;
    const symbolCap = symbol.toUpperCase();
    return this.marketDataService.getOHLCVData(exchange, symbolCap, timeframe, sinceNumber, limitNumber);
  }

@Get('/ticker')
@ApiOperation({ summary: 'Get ticker price' })
@ApiQuery({ name: 'exchange', description: 'Exchange name', required: true })
@ApiQuery({ name: 'symbol', description: 'Symbol to get ticker for', required: true })
@ApiResponse({ status: 200, description: 'Ticker price data' })
@ApiResponse({ status: 400, description: 'Bad Request' })
async getTickerPrice(
  @Query('exchange') exchange: string,
  @Query('symbol') symbol: string,
) {
  const symbolCap = symbol.toUpperCase();
  return this.marketDataService.getTickerPrice(exchange, symbolCap);
}

@Post('/multitickers')
@ApiOperation({ summary: 'Get multiple ticker prices' })
@ApiResponse({ status: 200, description: 'Ticker prices data' })
@ApiResponse({ status: 400, description: 'Bad Request' })
async getMultipleTickerPrices(
  @Body() body: TickersDto,
) {
  const { exchangeNames, symbols } = body;
  return this.marketDataService.getMultipleTickerPrices(exchangeNames, symbols);
}

@Get('/supported-symbols')
@ApiOperation({ summary: 'Get supported symbols' })
@ApiQuery({ name: 'exchange', description: 'Exchange name', required: true })
@ApiResponse({ status: 200, description: 'Supported symbols' })
@ApiResponse({ status: 400, description: 'Bad Request' })
async getSupportedSymbols(
  @Query('exchange') exchange: string,
) {
  return this.marketDataService.getSupportedSymbols(exchange);
}

}