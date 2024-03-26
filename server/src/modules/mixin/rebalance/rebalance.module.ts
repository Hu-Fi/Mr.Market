import { Module } from '@nestjs/common';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import { RebalanceController } from 'src/modules/mixin/rebalance/rebalance.controller';
import { ExchangeModule } from '../exchange/exchange.module';
import { SnapshotsModule } from '../snapshots/snapshots.module';
import {
  Token,
  Exchange,
  TokenExchange,
} from 'src/common/entities/rebalance-asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, Exchange, TokenExchange]),
    ExchangeModule,
    SnapshotsModule,
  ],
  controllers: [RebalanceController],
  providers: [RebalanceService, RebalanceRepository],
})
export class RebalanceModule {}
