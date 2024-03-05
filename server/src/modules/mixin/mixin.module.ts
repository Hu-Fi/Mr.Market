import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

@Module({
  imports: [SnapshotsModule, MessageModule, WithdrawalModule],
})
export class MixinModule {}
