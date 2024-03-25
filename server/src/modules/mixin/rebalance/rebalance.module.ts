import { Module } from '@nestjs/common';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CurrencyMinAmount,
  RebalanceExchange,
} from 'src/common/entities/rebalance-asset.entity';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import { RebalanceController } from 'src/modules/mixin/rebalance/rebalance.controller';
import { ExchangeModule } from '../exchange/exchange.module';
import { SnapshotsModule } from '../snapshots/snapshots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RebalanceExchange, CurrencyMinAmount]),
    ExchangeModule,
    SnapshotsModule,
  ],
  controllers: [RebalanceController],
  providers: [RebalanceService, RebalanceRepository],
})
export class RebalanceModule {}
