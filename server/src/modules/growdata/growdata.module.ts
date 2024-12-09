import { Module } from '@nestjs/common';
import { GrowdataService } from './growdata.service';
import { GrowdataController } from './growdata.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { GrowdataRepository } from './growdata.repository';
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
export class GrowdataModule {}
