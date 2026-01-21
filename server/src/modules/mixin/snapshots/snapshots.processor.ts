import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SnapshotsService } from './snapshots.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

@Processor('snapshots')
export class SnapshotsProcessor {
  private readonly logger = new Logger(SnapshotsProcessor.name);

  constructor(private readonly snapshotsService: SnapshotsService) { }

  @Process('process_snapshots')
  async handlePollSnapshots(job: Job) {
    // this.logger.debug('Processing snapshots...');
    try {
      const snapshots = await this.snapshotsService.fetchSnapshotsOnly();

      if (snapshots && snapshots.length > 0) {
        this.logger.debug(
          `Found ${snapshots.length} snapshots, queueing processing...`,
        );
        for (const snapshot of snapshots) {
          await (job.queue as any).add('process_snapshot', snapshot, {
            jobId: snapshot.snapshot_id, // Deduplication by ID
            removeOnComplete: true,
          });
        }
        await this.snapshotsService.updateSnapshotCursor(
          snapshots[0].created_at,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error polling snapshots: ${error.message}`,
        error.stack,
      );
    } finally {
      await (job.queue as any).add(
        'process_snapshots',
        {},
        {
          delay: 5000,
          removeOnComplete: true,
        },
      );
    }
  }

  @Process('process_snapshot')
  async handleProcessSnapshot(job: Job<SafeSnapshot>) {
    const snapshot = job.data;
    try {
      await this.snapshotsService.handleSnapshot(snapshot);
    } catch (error) {
      this.logger.error(
        `Failed to process snapshot ${snapshot.snapshot_id}: ${error.message}`,
      );
      throw error; // Let Bull handle retries
    }
  }
}
