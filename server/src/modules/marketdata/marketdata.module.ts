import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
import { MarketDataController } from './marketdata.controller';
import { MarketDataGateway } from './marketdata.gateway';

@Module({
  controllers:[MarketDataController],
  providers: [MarketDataGateway,MarketdataService],
  exports: [MarketdataService]
})
export class MarketdataModule {}
