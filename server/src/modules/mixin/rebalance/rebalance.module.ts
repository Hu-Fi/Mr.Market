import { Module } from '@nestjs/common';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CurrencyMinAmount,
  RebalanceExchange,
} from 'src/common/entities/rebalance-asset.entity';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RebalanceExchange, CurrencyMinAmount])],
  providers: [RebalanceService, RebalanceRepository, ExchangeService],
})
export class RebalanceModule {}
