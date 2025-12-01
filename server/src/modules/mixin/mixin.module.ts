import { Module, forwardRef } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { RebalanceModule } from './rebalance/rebalance.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';
import { WithdrawalModule } from '../market-making/withdrawal/withdrawal.module';
import { HttpModule } from '@nestjs/axios'; // Added this import

@Module({
  imports: [
    HttpModule,
    SnapshotsModule,
    ExchangeModule,
    MessageModule,
    UserModule,
    RebalanceModule,
    forwardRef(() => WithdrawalModule),
  ],
  exports: [
    ExchangeModule,
    SnapshotsModule,
  ],
})
export class MixinModule { }
