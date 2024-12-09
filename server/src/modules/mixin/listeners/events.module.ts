import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeListener } from 'src/modules/mixin/listeners/exchange.listener';
import { MixinListener } from 'src/modules/mixin/listeners/mixin.listener';
import { SpotOrderListener } from 'src/modules/mixin/listeners/spot.listener';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { SnapshotsModule } from 'src/modules/mixin/snapshots/snapshots.module';
import { CustomConfigModule } from 'src/modules/customConfig/customConfig.module';
import { SimplyGrowListener } from 'src/modules/mixin/listeners/simply_grow.listener';
import { ArbitrageListener } from 'src/modules/mixin/listeners/arbitrage.listener';
import { MarketMakingListener } from 'src/modules/mixin/listeners/market_making.listener';
import { StrategyModule } from 'src/modules/strategy/strategy.module';
import { GrowdataModule } from 'src/modules/growdata/growdata.module';
import { LoggerModule } from 'src/modules/logger/logger.module';

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
    ExchangeListener,
    MixinListener,
    SpotOrderListener,
    SimplyGrowListener,
    ArbitrageListener,
    MarketMakingListener,
    ConfigService,
  ],
  exports: [
    SpotOrderListener,
    ExchangeListener,
    MixinListener,
    SimplyGrowListener,
    ArbitrageListener,
    MarketMakingListener,
  ],
})
export class EventListenersModule {}
