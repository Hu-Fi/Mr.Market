import { Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SnapshotsService } from './snapshots.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { Cron } from '@nestjs/schedule';

@Processor('snapshots')
export class SnapshotsProcessor implements OnModuleInit {
  private readonly logger = new Logger(SnapshotsProcessor.name);
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private readonly COMPLETED_JOB_RETENTION = 60 * 60 * 1000; // Keep for 1 hour
  private isPolling = false;

  constructor(
    private readonly snapshotsService: SnapshotsService,
    @InjectQueue('snapshots') private readonly snapshotsQueue: Queue,
  ) {}

  async onModuleInit() {
    this.logger.log(
      `Snapshot polling enabled: ${this.snapshotsService.isPollingEnabled()}`,
    );

    // Start periodic cleanup of old completed jobs
    this.scheduleCleanup();
  }

  private scheduleCleanup() {
    setInterval(async () => {
      try {
        // Clean up completed jobs older than retention period
        await this.snapshotsQueue.clean(
          this.COMPLETED_JOB_RETENTION,
          'completed',
        );
        this.logger.log('Cleaned up old completed polling jobs');
      } catch (error) {
        this.logger.error(
          `Failed to clean up old jobs: ${error.message}`,
          error.stack,
        );
      }
    }, this.CLEANUP_INTERVAL);
  }

  @Cron('*/3 * * * * *') // 3 seconds
  async pollSnapshotsCron() {
    if (!this.snapshotsService.isPollingEnabled()) {
      return;
    }

    if (this.isPolling) {
      this.logger.debug('Skipping snapshot poll; previous run still active.');
      return;
    }

    this.isPolling = true;
    this.logger.debug('Polling for snapshots...');
    try {
      const { snapshots, newSnapshots, newestTimestamp } =
        await this.snapshotsService.fetchSnapshots();
      this.logger.debug(
        `Fetched ${snapshots?.length || 0} snapshots from Mixin`,
      );

      if (!newSnapshots.length) {
        this.logger.debug(
          'No new snapshots to process (all filtered by cursor)',
        );
        return;
      }

      this.logger.log(
        `Found ${newSnapshots.length} new snapshots (${
          snapshots.length - newSnapshots.length
        } filtered by cursor)`,
      );

      for (const snapshot of newSnapshots) {
        this.logger.debug(
          `Queueing snapshot: ${snapshot.snapshot_id} at ${snapshot.created_at}`,
        );
        await this.snapshotsQueue.add('process_snapshot', snapshot, {
          jobId: snapshot.snapshot_id, // Deduplication by ID
          removeOnComplete: true,
        });
      }

      this.logger.log(
        `Successfully queued ${newSnapshots.length} snapshots, cursor updated to ${newestTimestamp}`,
      );
    } catch (error) {
      this.logger.error(
        `Error polling snapshots: ${error.message}`,
        error.stack,
      );
    } finally {
      this.isPolling = false;
    }
  }

  @Process('process_snapshot')
  async handleProcessSnapshot(job: Job<SafeSnapshot>) {
    const snapshot = job.data;
    this.logger.log(
      `[Processor] Starting to process snapshot: ${snapshot.snapshot_id} at ${snapshot.created_at}`,
    );
    try {
      // Process the snapshot
      await this.snapshotsService.handleSnapshot(snapshot);

      this.logger.log(
        `[Processor] Successfully processed snapshot: ${snapshot.snapshot_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process snapshot ${snapshot.snapshot_id}: ${error.message}`,
        error.stack,
      );
      throw error; // Let Bull handle retries
    }
  }

  // ========== Queue Health Monitoring ==========

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    // Only log individual snapshot processing, not polling cycles
    if (job.name === 'process_snapshot') {
      this.logger.debug(
        `Snapshot ${job.data.snapshot_id} processed successfully`,
      );
    }
    // Polling cycle completion is too noisy, removed
  }

  @OnQueueEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.name} (ID: ${job.id}) failed after ${job.attemptsMade} attempts: ${error.message}`,
      error.stack,
    );

    if (job.name === 'process_snapshot') {
      this.logger.warn(
        `Snapshot processing failed for: ${job.data.snapshot_id}`,
      );
    }
  }

  @OnQueueEvent('stalled')
  onStalled(job: Job) {
    this.logger.warn(
      `Job ${job.name} (ID: ${job.id}) has stalled. This may indicate a worker crash or long-running operation.`,
    );
  }

  @OnQueueEvent('error')
  onError(error: Error) {
    this.logger.error(`Queue error occurred: ${error.message}`, error.stack);
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    // Only log when processing individual snapshots, not polling cycles
    if (job.name === 'process_snapshot') {
      this.logger.debug(`Processing snapshot: ${job.data.snapshot_id}`);
    }
  }

  @OnQueueEvent('paused')
  onPaused() {
    this.logger.warn('Queue has been paused');
  }

  @OnQueueEvent('resumed')
  onResumed() {
    this.logger.log('Queue has been resumed');
  }

  @OnQueueEvent('cleaned')
  onCleaned(jobs: Job[], type: string) {
    this.logger.log(`Cleaned ${jobs.length} jobs of type: ${type}`);
  }
}
