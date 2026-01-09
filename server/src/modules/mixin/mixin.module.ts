import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
// import { RebalanceModule } from './rebalance/rebalance.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

@Module({
  imports: [
    SnapshotsModule,
    ExchangeModule,
    MessageModule,
    UserModule,
    WithdrawalModule,
    // RebalanceModule,
  ],
  exports: [ExchangeModule, SnapshotsModule, WithdrawalModule],
})
export class MixinModule {}
