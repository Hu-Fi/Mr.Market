import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';
import { SpotdataController } from 'src/modules/spotdata/spotdata.controller';
import { SpotdataRepository } from 'src/modules/spotdata/spotdata.repository';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { MarketdataModule } from '../marketdata/marketdata.module';
import { ExchangeModule } from '../mixin/exchange/exchange.module';
import { AdminSettingsService } from '../admin/settings/adminSettings.service';
import { AdminSettingsRepository } from '../admin/settings/adminSettings.repository';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Module({
  imports: [
    CacheModule.register(),
    MarketdataModule,
    ExchangeModule,
    TypeOrmModule.forFeature([SpotdataTradingPair, CustomConfigEntity]),
  ],
  controllers: [SpotdataController],
  providers: [
    SpotdataService,
    SpotdataRepository,
    AdminSettingsService,
    AdminSettingsRepository,
  ],
  exports: [
    SpotdataService,
    CacheModule,
    SpotdataRepository,
    AdminSettingsService,
    AdminSettingsRepository,
  ],
})
export class SpotdataModule {}
