import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeModule } from 'src/modules/mixin/exchange/exchange.module';
import { SnapshotsModule } from 'src/modules/mixin/snapshots/snapshots.module';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import { RebalanceController } from 'src/modules/mixin/rebalance/rebalance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ConfigModule,
    ExchangeModule,
    SnapshotsModule,
  ],
  controllers: [RebalanceController],
  providers: [RebalanceService, RebalanceRepository],
})
export class RebalanceModule { }
