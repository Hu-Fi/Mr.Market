import { Module } from '@nestjs/common';
import { MarketdataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { ExchangeInitModule } from '../../infrastructure/exchange-init/exchange-init.module';

import { AdminMarketMakingConfigModule } from '../../admin/market-making-config/admin-market-making-config.module';

@Module({
  imports: [CacheModule.register(), ExchangeInitModule, AdminMarketMakingConfigModule],
  controllers: [MarketDataController],
  providers: [MarketDataGateway, MarketdataService],
  exports: [MarketDataGateway, MarketdataService, CacheModule],
})
export class MarketdataModule { }
