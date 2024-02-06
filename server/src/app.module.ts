import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { TradeModule } from './modules/trade/trade.module';
import { Transaction } from './common/entities/transaction.entity';
import { StrategyModule } from './modules/strategy/strategy.module';
import { MarketdataModule } from './modules/marketdata/marketdata.module';
import { HealthModule } from './modules/health/health.module';

dotenv.config();

@Module({
  imports: [
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
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}