import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminMarketMakingConfigService } from './admin-market-making-config.service';

@ApiTags('admin-market-making-config')
@Controller('admin/market-making/config')
export class AdminMarketMakingConfigController {
  constructor(private readonly configService: AdminMarketMakingConfigService) { }

  @Post('/pairs')
  @ApiOperation({ summary: 'Enable or disable a trading pair' })
  @ApiResponse({ status: 200, description: 'Configuration updated' })
  async updatePairConfig(
    @Body()
    body: {
      exchange: string;
      symbol: string;
      base_symbol: string;
      quote_symbol: string;
      base_asset_id: string;
      quote_asset_id: string;
      base_icon: string;
      quote_icon: string;
      enabled: boolean;
    },
  ) {
    if (body.enabled) {
      return this.configService.enablePair(
        body.exchange,
        body.symbol,
        body.base_symbol,
        body.quote_symbol,
        body.base_asset_id,
        body.quote_asset_id,
        body.base_icon,
        body.quote_icon,
      );
    } else {
      return this.configService.disablePair(body.exchange, body.symbol);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all market making configuration' })
  async getAllConfig() {
    return this.configService.getAllConfig();
  }
}
