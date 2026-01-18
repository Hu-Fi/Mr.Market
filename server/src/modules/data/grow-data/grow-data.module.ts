import { Module } from '@nestjs/common';
import { GrowdataService } from './grow-data.service';
import { GrowdataController } from './grow-data.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { MixinClientModule } from 'src/modules/mixin/client/mixin-client.module';
import { GrowdataRepository } from './grow-data.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GrowdataExchange,
  GrowdataSimplyGrowToken,
  GrowdataArbitragePair,
  GrowdataMarketMakingPair,
} from 'src/common/entities/grow-data.entity';

@Module({
  imports: [
    CacheModule.register(),
    MixinClientModule,
    TypeOrmModule.forFeature([
      GrowdataExchange,
      GrowdataSimplyGrowToken,
      GrowdataArbitragePair,
      GrowdataMarketMakingPair,
    ]),
  ],
  controllers: [GrowdataController],
  providers: [GrowdataService, GrowdataRepository],
  exports: [GrowdataService, CacheModule, GrowdataRepository],
})
export class GrowdataModule { }
