import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { TradeModule } from './modules/trade/trade.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { MarketdataModule } from './modules/marketdata/marketdata.module';
import { PerformanceModule } from './modules/performance/performance.module';

import configuration from './config/configuration';
import { HealthModule } from './modules/health/health.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import { LoggerModule } from './modules/logger/logger.module';
import { CustomLogger } from './modules/logger/logger.service';
import { MixinModule } from './modules/mixin/mixin.module';
import { EventListenersModule } from './modules/mixin/listeners/events.module';

import { Trade } from './common/entities/trade.entity';
import { Transaction } from './common/entities/transaction.entity';
import { UserBalance } from './common/entities/user-balance.entity';
import { Performance } from './common/entities/performance.entity';
import { Snapshot } from './common/entities/snapshots.entity';
import { SpotOrder } from './common/entities/spot-order.entity';
import { exchangeAPIKeysConfig } from './common/entities/exchange-api-keys.entity';
import { CustomConfigEntity } from './common/entities/custom-config.entity';
import {
  MixinReleaseToken,
  MixinReleaseHistory,
} from './common/entities/mixin-release.entity';
import { MixinMessage } from 'src/common/entities/mixin-message.entity';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from './common/entities/strategy-user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ExchangeInitModule } from './modules/exchangeInit/exchangeInit.module';
import { AdminModule } from './modules/admin/admin.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { Web3Module } from './modules/web3/web3.module';
import { StrategyInstance } from './common/entities/strategy-instances.entity';
import { ArbitrageHistory } from './common/entities/arbitrage-order.entity';
import { MarketMakingHistory } from './common/entities/market-making-order.entity';
import { Contribution } from './common/entities/contribution.entity';
import { GrowdataModule } from './modules/growdata/growdata.module';
import {
  GrowdataArbitragePair,
  GrowdataExchange,
  GrowdataMarketMakingPair,
  GrowdataSimplyGrowToken,
} from './common/entities/grow-data.entity';
import {
  RebalanceExchange,
  RebalanceHistory,
  RebalanceToken,
  RebalanceTokenExchange,
} from './common/entities/rebalance-asset.entity';
import { AdminController } from './modules/admin/admin.controller';
import { SpotdataTradingPair } from './common/entities/spot-data.entity';
import { SpotdataModule } from './modules/spotdata/spotdata.module';

dotenv.config();

@Module({
  imports: [
    LoggerModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        Trade,
        ArbitrageHistory,
        MarketMakingHistory,
        StrategyInstance,
        Performance,
        Transaction,
        UserBalance,
        Snapshot,
        SpotOrder,
        exchangeAPIKeysConfig,
        CustomConfigEntity,
        Contribution,
        MixinReleaseToken,
        MixinReleaseHistory,
        MixinMessage,
        MixinUser,
        RebalanceToken,
        RebalanceExchange,
        RebalanceTokenExchange,
        RebalanceHistory,
        ArbitrageOrder,
        MarketMakingOrder,
        PaymentState,
        RebalanceToken,
        RebalanceExchange,
        RebalanceHistory,
        RebalanceTokenExchange,
        MarketMakingOrder,
        ArbitrageOrder,
        SimplyGrowOrder,
        SpotdataTradingPair,
        GrowdataExchange,
        GrowdataSimplyGrowToken,
        GrowdataArbitragePair,
        GrowdataMarketMakingPair,
      ],
      synchronize: false,
      ssl: process.env.POSTGRES_SSL === 'true',
    }),
    ScheduleModule.forRoot(),
    TradeModule,
    StrategyModule,
    PerformanceModule,
    MarketdataModule,
    SpotdataModule,
    GrowdataModule,
    ExchangeInitModule,
    CoingeckoModule,
    HealthModule,
    MixinModule,
    EventListenersModule,
    AuthModule,
    AdminModule,
    CampaignModule,
    Web3Module,
  ],
  controllers: [AppController, AdminController],
  providers: [CustomLogger],
})
export class AppModule {}
