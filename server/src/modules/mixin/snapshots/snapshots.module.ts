import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { Snapshot } from 'src/common/entities/snapshots.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Snapshot])],
  providers: [SnapshotsService],
})
export class SnapshotsModule {}
