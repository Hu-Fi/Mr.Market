import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TradeModule } from './modules/trade/trade.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { MarketdataModule } from './modules/marketdata/marketdata.module';
import { PerformanceModule } from './modules/performance/performance.module';

// import { TransactionsModule } from './modules/transactions/transactions.module';
import configuration from './config/configuration';
import { HealthModule } from './modules/health/health.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import { LoggerModule } from './modules/logger/logger.module';
import { CustomLogger } from './modules/logger/logger.service';
import { MixinModule } from './modules/mixin/mixin.module';
import { AdminController } from './modules/admin/admin.controller';
import { EventListenersModule } from './modules/mixin/listeners/events.module';

import { Trade } from './common/entities/trade.entity';
import { Transaction } from './common/entities/transaction.entity';
import { UserBalance } from './common/entities/user-balance.entity';
import { Performance } from './common/entities/performance.entity';
import { Snapshot } from './common/entities/snapshots.entity';
import { SpotOrder } from './common/entities/spot-order.entity';
import { APIKeysConfig } from './common/entities/api-keys.entity';
import { CustomConfigEntity } from './common/entities/custom-config.entity';
import {
  MixinReleaseToken,
  MixinReleaseHistory,
} from './common/entities/mixin-release.entity';
import { MixinMessage } from 'src/common/entities/mixin-message.entity';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ExchangeInitModule } from './modules/exchangeInit/exchangeInit.module';
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
        Performance,
        Transaction,
        UserBalance,
        Snapshot,
        SpotOrder,
        APIKeysConfig,
        CustomConfigEntity,
        MixinReleaseToken,
        MixinReleaseHistory,
        MixinMessage,
        MixinUser,
      ],
      synchronize: true,
      ssl: process.env.POSTGRES_SSL === 'true',
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    TradeModule,
    StrategyModule,
    PerformanceModule,
    MarketdataModule,
    ExchangeInitModule,
    // TransactionsModule,
    CoingeckoModule,
    HealthModule,
    MixinModule,
    EventListenersModule,
    AuthModule,
  ],
  controllers: [AppController, AdminController],
  providers: [CustomLogger, AppService],
})
export class AppModule {}
