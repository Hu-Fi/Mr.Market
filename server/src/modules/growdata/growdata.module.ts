import { Module } from '@nestjs/common';
import { GrowdataService } from './growdata.service';
import { GrowdataController } from './growdata.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { GrowdataRepository } from './growdata.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Exchange,
  SimplyGrowToken,
  ArbitragePair,
  MarketMakingPair,
} from 'src/common/entities/growdata.entity';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      Exchange,
      SimplyGrowToken,
      ArbitragePair,
      MarketMakingPair,
    ]),
  ],
  controllers: [GrowdataController],
  providers: [GrowdataService, GrowdataRepository],
  exports: [GrowdataService, CacheModule, GrowdataRepository],
})
export class GrowdataModule {}
