import { Module, forwardRef } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
// import { RebalanceModule } from './rebalance/rebalance.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SnapshotsModule,
    ExchangeModule,
    MessageModule,
    UserModule,
    // RebalanceModule,
  ],
  exports: [
    ExchangeModule,
    SnapshotsModule,
  ],
})
export class MixinModule { }
