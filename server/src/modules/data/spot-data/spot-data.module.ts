import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SpotdataService } from 'src/modules/data/spot-data/spot-data.service';
import { SpotdataController } from 'src/modules/data/spot-data/spot-data.controller';
import { SpotdataRepository } from 'src/modules/data/spot-data/spot-data.repository';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { MarketdataModule } from '../market-data/market-data.module';

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
export class SpotdataModule { }
