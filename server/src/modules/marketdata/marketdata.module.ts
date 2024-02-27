import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { MarketDataController } from './marketdata.controller';
import { MarketDataGateway } from './marketdata.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers:[MarketDataController],
  providers: [MarketDataGateway,MarketdataService],
  exports: [MarketdataService,MarketDataGateway,CacheModule]
})
export class MarketdataModule {}