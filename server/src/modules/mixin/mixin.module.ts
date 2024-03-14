import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [SnapshotsModule, MessageModule, WithdrawalModule, ExchangeModule],
})
export class MixinModule {}
