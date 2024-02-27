import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TradeModule } from './modules/trade/trade.module';
import { Transaction } from './common/entities/transaction.entity';
import { StrategyModule } from './modules/strategy/strategy.module';
import { MarketdataModule } from './modules/marketdata/marketdata.module';
import { HealthModule } from './modules/health/health.module';
import { CoingeckoModule } from './modules/coingecko/coingecko.module';
import configuration from './config/configuration';
dotenv.config();

@Module({
  imports: [
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
      entities: [Transaction],
      synchronize: true,
    }),
    TradeModule,
    StrategyModule,
    MarketdataModule,
    CoingeckoModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
