import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';
import { SpotdataController } from 'src/modules/spotdata/spotdata.controller';
import { SpotdataRepository } from 'src/modules/spotdata/spotdata.repository';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { MarketdataModule } from '../marketdata/marketdata.module';

@Module({
  imports: [
    CacheModule.register(),
    MarketdataModule,
    TypeOrmModule.forFeature([SpotdataTradingPair]),
  ],
  controllers: [SpotdataController],
  providers: [SpotdataService, SpotdataRepository],
  exports: [SpotdataService, CacheModule, SpotdataRepository],
})
export class SpotdataModule {}
