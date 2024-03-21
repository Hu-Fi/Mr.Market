import { Module } from '@nestjs/common';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';

@Module({
  providers: [RebalanceService],
})
export class RebalanceModule {}
