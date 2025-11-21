import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { MarketDataController } from './marketdata.controller';
import { MarketDataGateway } from './marketdata.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';

import { AdminMarketMakingConfigModule } from '../admin/market-making-config/admin-market-making-config.module';

@Module({
  imports: [CacheModule.register(), ExchangeInitModule, AdminMarketMakingConfigModule],
  controllers: [MarketDataController],
  providers: [MarketDataGateway, MarketdataService],
  exports: [MarketDataGateway, MarketdataService, CacheModule],
})
export class MarketdataModule { }
