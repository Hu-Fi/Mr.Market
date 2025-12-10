import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnapshotsService } from './snapshots.service';
import { Snapshot } from 'src/common/entities/snapshots.entity';
import { SnapshotsRepository } from './snapshots.repository';
import { BullModule } from '@nestjs/bull';
import { SnapshotsProcessor } from './snapshots.processor';
import { MixinClientModule } from '../client/mixin-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Snapshot]),
    BullModule.registerQueue({
      name: 'snapshots',
    }),
    MixinClientModule,
  ],
  providers: [ConfigService, SnapshotsService, SnapshotsRepository, SnapshotsProcessor],
  exports: [SnapshotsService, SnapshotsRepository, BullModule],
})
export class SnapshotsModule { }
