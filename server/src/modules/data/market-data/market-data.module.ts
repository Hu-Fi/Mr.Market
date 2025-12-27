import { Module } from '@nestjs/common';
import { MarketdataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { ExchangeInitModule } from '../../infrastructure/exchange-init/exchange-init.module';

@Module({
  imports: [CacheModule.register(), ExchangeInitModule],
  controllers: [MarketDataController],
  providers: [MarketDataGateway, MarketdataService],
  exports: [MarketDataGateway, MarketdataService, CacheModule],
})
export class MarketdataModule {}
