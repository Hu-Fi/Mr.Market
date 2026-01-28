import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { TradeModule } from './modules/market-making/trade/trade.module';
import { StrategyModule } from './modules/market-making/strategy/strategy.module';
import { MarketdataModule } from './modules/data/market-data/market-data.module';
import { PerformanceModule } from './modules/market-making/performance/performance.module';
import { UserOrdersModule } from './modules/market-making/user-orders/user-orders.module';

import configuration from './config/configuration';
import { HealthModule } from './modules/infrastructure/health/health.module';
import { CoingeckoModule } from './modules/data/coingecko/coingecko.module';
import { LoggerModule } from './modules/infrastructure/logger/logger.module';
import { CustomLogger } from './modules/infrastructure/logger/logger.service';
import { MixinModule } from './modules/mixin/mixin.module';
import { EventListenersModule } from './modules/mixin/listeners/events.module';

import { Trade } from './common/entities/trade.entity';
import { Transaction } from './common/entities/transaction.entity';
import { UserBalance } from './common/entities/user-balance.entity';
import { Performance } from './common/entities/performance.entity';

import { SpotOrder } from './common/entities/spot-order.entity';
import { APIKeysConfig } from './common/entities/api-keys.entity';
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
} from './common/entities/user-orders.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ExchangeInitModule } from './modules/infrastructure/exchange-init/exchange-init.module';
import { AdminModule } from './modules/admin/admin.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { Web3Module } from './modules/web3/web3.module';
import { StrategyInstance } from './common/entities/strategy-instances.entity';
import { ArbitrageHistory } from './common/entities/arbitrage-order.entity';
import { MarketMakingHistory } from './common/entities/market-making-order.entity';
import { Contribution } from './common/entities/contribution.entity';
import { GrowdataModule } from './modules/data/grow-data/grow-data.module';
import {
  GrowdataArbitragePair,
  GrowdataExchange,
  GrowdataMarketMakingPair,
  GrowdataSimplyGrowToken,
} from './common/entities/grow-data.entity';
import { AdminController } from './modules/admin/admin.controller';
import { SpotdataTradingPair } from './common/entities/spot-data.entity';
import { SpotdataModule } from './modules/data/spot-data/spot-data.module';
import { MetricsModule } from './modules/market-making/metrics/metrics.module';
import { Withdrawal } from './common/entities/withdrawal.entity';
import { Campaign } from './common/entities/campaign.entity';
import { CampaignParticipation } from './common/entities/campaign-participation.entity';
import { LocalCampaignModule } from './modules/market-making/local-campaign/local-campaign.module';

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
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'data/mr_market.db',
      entities: [
        Trade,
        ArbitrageHistory,
        MarketMakingHistory,
        StrategyInstance,
        Performance,
        Transaction,
        UserBalance,
        SpotOrder,
        APIKeysConfig,
        CustomConfigEntity,
        Contribution,
        MixinReleaseToken,
        MixinReleaseHistory,
        MixinMessage,
        MixinUser,
        ArbitrageOrder,
        MarketMakingOrder,
        PaymentState,
        SimplyGrowOrder,
        SpotdataTradingPair,
        GrowdataExchange,
        GrowdataSimplyGrowToken,
        GrowdataArbitragePair,
        GrowdataMarketMakingPair,
        Withdrawal,
        Campaign,
        CampaignParticipation,
      ],
      synchronize: false,
      migrationsRun: true,
      extra: {
        flags: ['-WAL'],
      },
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
    MetricsModule,
    UserOrdersModule,
    LocalCampaignModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [CustomLogger],
})
export class AppModule { }
