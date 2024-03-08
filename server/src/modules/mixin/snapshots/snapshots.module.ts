import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsRepository } from './snapshots.repository';
import { Snapshot } from 'src/common/entities/snapshots.entity';
import { SpotOrderListener } from '../listeners/spot.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot])],
  providers: [
    SnapshotsService,
    ConfigService,
    SnapshotsRepository,
    SpotOrderListener,
  ],
  exports: [SnapshotsService, SnapshotsRepository],
})
export class SnapshotsModule {}
