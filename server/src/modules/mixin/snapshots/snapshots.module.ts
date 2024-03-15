// snapshots.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnapshotsService } from './snapshots.service';
import { Snapshot } from 'src/common/entities/snapshots.entity';
import { SnapshotsRepository } from './snapshots.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot])],
  providers: [ConfigService, SnapshotsService, SnapshotsRepository],
  exports: [SnapshotsService, SnapshotsRepository],
})
export class SnapshotsModule {}
