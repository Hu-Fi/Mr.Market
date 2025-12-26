// exchange.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SpotOrder } from 'src/common/entities/spot-order.entity';
import { APIKeysConfig } from 'src/common/entities/api-keys.entity';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';
import {
  MixinReleaseHistory,
  MixinReleaseToken,
} from 'src/common/entities/mixin-release.entity';
import { ExchangeController } from './exchange.controller';
import { ExchangeUserController } from './exchange-client.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      APIKeysConfig,
      SpotOrder,
      MixinReleaseToken,
      MixinReleaseHistory,
    ]),
  ],
  providers: [ExchangeService, ExchangeRepository],
  exports: [ExchangeService, ExchangeRepository],
  controllers: [ExchangeController, ExchangeUserController],
})
export class ExchangeModule { }
