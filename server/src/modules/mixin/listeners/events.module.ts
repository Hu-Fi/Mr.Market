import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { SnapshotsModule } from 'src/modules/mixin/snapshots/snapshots.module';
import { CustomConfigModule } from 'src/modules/infrastructure/custom-config/custom-config.module';
import { StrategyModule } from 'src/modules/market-making/strategy/strategy.module';
import { GrowdataModule } from 'src/modules/data/grow-data/grow-data.module';
import { LoggerModule } from 'src/modules/infrastructure/logger/logger.module';

@Module({
  imports: [
    ExchangeModule,
    SnapshotsModule,
    CustomConfigModule,
    StrategyModule,
    GrowdataModule,
    LoggerModule,
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    ConfigService,
  ],
})
export class EventListenersModule { }
