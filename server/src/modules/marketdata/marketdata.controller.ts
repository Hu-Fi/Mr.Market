// market-data.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Get('/tickers')
  @ApiOperation({ summary: 'Get tickers' })
  @ApiQuery({ name: 'exchange', description: 'Exchange name', required: true, type: 'String' })
  @ApiQuery({ name: 'symbols', description: 'Comma-separated list of symbols to get data for', required: true, type: 'String' })
  @ApiResponse({ status: 200, description: 'tickers data' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getTickers(
    @Query('exchange') exchange: string,
    @Query('symbols') symbols: string,
  ) {
    // Split the symbols string by comma to get an array of symbols
    const symbolsArray = symbols.split(',');
    const symbolsCap = symbolsArray.map(symbol => symbol.toUpperCase());
    return this.marketDataService.getTickers(exchange, symbolsCap);
  }
}