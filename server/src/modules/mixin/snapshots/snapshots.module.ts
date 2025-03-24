// snapshots.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnapshotsService } from './snapshots.service';
import { Snapshot } from 'src/common/entities/snapshots.entity';
import { SnapshotsRepository } from './snapshots.repository';
import { MixinMessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot]), MixinMessageModule],
  providers: [ConfigService, SnapshotsService, SnapshotsRepository],
  exports: [SnapshotsService, SnapshotsRepository],
})
export class SnapshotsModule {}
