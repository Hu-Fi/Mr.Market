
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SnapshotsService } from './snapshots.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

@Processor('snapshots')
export class SnapshotsProcessor {
  private readonly logger = new Logger(SnapshotsProcessor.name);

  constructor(
    private readonly snapshotsService: SnapshotsService,
  ) { }

  @Process('poll_snapshots')
  async handlePollSnapshots(job: Job) {
    this.logger.log('Polling snapshots...');
    try {
      const snapshots = await this.snapshotsService.fetchSnapshotsOnly();

      if (snapshots && snapshots.length > 0) {
        this.logger.log(`Found ${snapshots.length} snapshots, queueing processing...`);
        for (const snapshot of snapshots) {
          await (job.queue as any).add('process_snapshot', snapshot, {
            jobId: snapshot.snapshot_id, // Deduplication by ID
            removeOnComplete: true,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Error polling snapshots: ${error.message}`, error.stack);
    } finally {
      // Re-queue the poll job
      // We use a recursive strategy here to ensure we don't overlap polls too aggressively
      // Alternatively, we could use a Repeatable Job, but this allows dynamic delay if needed.
      // However, for "best practice" looping, a Repeatable Job is often cleaner if the interval is fixed.
      // But if we want to ensure "wait 5s AFTER finish", we do this:
      await (job.queue as any).add('poll_snapshots', {}, {
        delay: 5000,
        removeOnComplete: true
      });
    }
  }

  @Process('process_snapshot')
  async handleProcessSnapshot(job: Job<SafeSnapshot>) {
    const snapshot = job.data;
    try {
      await this.snapshotsService.handleSnapshot(snapshot);
    } catch (error) {
      this.logger.error(`Failed to process snapshot ${snapshot.snapshot_id}: ${error.message}`);
      throw error; // Let Bull handle retries
    }
  }
}
