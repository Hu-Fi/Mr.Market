import { Module } from '@nestjs/common';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';
import { MixinMessageModule } from './message/message.module';

@Module({
  imports: [SnapshotsModule, ExchangeModule, UserModule, MixinMessageModule],
  exports: [SnapshotsModule, ExchangeModule, UserModule, MixinMessageModule],
})
export class MixinModule {}
