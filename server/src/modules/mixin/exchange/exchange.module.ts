// exchange.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotOrder } from 'src/common/entities/spot-order.entity';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';
import { exchangeAPIKeysConfig } from 'src/common/entities/exchange-api-keys.entity';
import {
  MixinReleaseHistory,
  MixinReleaseToken,
} from 'src/common/entities/mixin-release.entity';
import { ExchangeUserController } from './exchange-client.controller';
import {
  TransferRecord,
  WithdrawalRecord,
} from 'src/common/entities/rebalance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      exchangeAPIKeysConfig,
      SpotOrder,
      MixinReleaseToken,
      MixinReleaseHistory,
      TransferRecord,
      WithdrawalRecord,
    ]),
  ],
  providers: [ExchangeService, ExchangeRepository],
  exports: [ExchangeService, ExchangeRepository],
  controllers: [ExchangeUserController],
})
export class ExchangeModule {}
