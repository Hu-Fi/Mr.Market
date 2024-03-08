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
import { Transaction } from './common/entities/transaction.entity';
import { StrategyModule } from './modules/strategy/strategy.module';
import { MarketdataModule } from './modules/marketdata/marketdata.module';

import { Trade } from './common/entities/trade.entity';
import { PerformanceModule } from './modules/performance/performance.module';
// import { TransactionsModule } from './modules/transactions/transactions.module';
import { UserBalance } from './common/entities/user-balance.entity';
import { Performance } from './common/entities/performance.entity';
import { HealthModule } from './modules/health/health.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import configuration from './config/configuration';
import { AdminModule } from './modules/admin/admin.module';
import { LoggerModule } from './modules/logger/logger.module';
import { CustomLogger } from './modules/logger/logger.service';
import { MixinModule } from './modules/mixin/mixin.module';
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
      entities: [Trade, Performance, Transaction, UserBalance],
      synchronize: true,
      ssl: Boolean(process.env.POSTGRES_SSL) || true,
    }),
    ScheduleModule.forRoot(),
    TradeModule,
    StrategyModule,
    MarketdataModule,
    PerformanceModule,
    // TransactionsModule
    CoingeckoModule,
    HealthModule,
    AdminModule,
    MixinModule,
  ],
  controllers: [AppController],
  providers: [CustomLogger, AppService],
})
export class AppModule {}
