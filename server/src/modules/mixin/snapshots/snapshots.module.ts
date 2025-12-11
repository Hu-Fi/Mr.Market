import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnapshotsService } from './snapshots.service';
import { BullModule } from '@nestjs/bull';
import { SnapshotsProcessor } from './snapshots.processor';
import { MixinClientModule } from '../client/mixin-client.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'snapshots',
    }),
    MixinClientModule,
  ],
  providers: [ConfigService, SnapshotsService, SnapshotsProcessor],
  exports: [SnapshotsService, BullModule],
})
export class SnapshotsModule { }
