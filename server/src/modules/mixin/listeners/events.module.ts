import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeListener } from './exchange.listener';
import { MixinListener } from './mixin.listener';
import { SpotOrderListener } from './spot.listener';
import { ExchangeModule } from '../exchange/exchange.module';
import { SnapshotsModule } from '../snapshots/snapshots.module';
import { CustomConfigModule } from 'src/modules/customConfig/customConfig.module';

@Module({
  imports: [ ExchangeModule, SnapshotsModule, CustomConfigModule ],
  providers: [
    ExchangeListener,
    MixinListener,
    SpotOrderListener,
    ConfigService,
  ],
  exports: [SpotOrderListener, ExchangeListener, MixinListener],
})
export class EventListenersModule {}
