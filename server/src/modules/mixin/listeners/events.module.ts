import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeListener } from 'src/modules/mixin/listeners/exchange.listener';
import { MixinListener } from 'src/modules/mixin/listeners/mixin.listener';
import { SpotOrderListener } from 'src/modules/mixin/listeners/spot.listener';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { SnapshotsModule } from 'src/modules/mixin/snapshots/snapshots.module';
import { CustomConfigModule } from 'src/modules/customConfig/customConfig.module';
import { ArbitrageListener } from 'src/modules/mixin/listeners/arbitrage.listener';
import { MarketMakingListener } from 'src/modules/mixin/listeners/market_making.listener';

@Module({
  imports: [ExchangeModule, SnapshotsModule, CustomConfigModule],
  providers: [
    ExchangeListener,
    MixinListener,
    SpotOrderListener,
    ArbitrageListener,
    MarketMakingListener,
    ConfigService,
  ],
  exports: [
    SpotOrderListener,
    ExchangeListener,
    MixinListener,
    ArbitrageListener,
    MarketMakingListener,
  ],
})
export class EventListenersModule {}
