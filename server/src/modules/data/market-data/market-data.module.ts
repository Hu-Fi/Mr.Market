import { Module } from '@nestjs/common';
import { MarketdataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [CacheModule.register()],
  controllers: [MarketDataController],
  providers: [MarketDataGateway, MarketdataService],
  exports: [MarketDataGateway, MarketdataService, CacheModule],
})
export class MarketdataModule { }
