import { Module } from '@nestjs/common';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ExchangeModule } from './exchange/exchange.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SnapshotsModule, ExchangeModule, UserModule],
})
export class MixinModule {}
