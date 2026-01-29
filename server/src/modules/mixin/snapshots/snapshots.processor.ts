import { Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SnapshotsService } from './snapshots.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

@Processor('snapshots')
export class SnapshotsProcessor implements OnModuleInit {
  private readonly logger = new Logger(SnapshotsProcessor.name);
  private readonly POLL_DELAY = 3000; // 3 seconds
  private loopFailureCount = 0;
  private readonly MAX_LOOP_FAILURES = 3;
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private readonly COMPLETED_JOB_RETENTION = 60 * 60 * 1000; // Keep for 1 hour

  constructor(
    private readonly snapshotsService: SnapshotsService,
    @InjectQueue('snapshots') private readonly snapshotsQueue: Queue,
  ) {}

  async onModuleInit() {
    // Clean up any stale delayed/waiting jobs from previous runs
    await this.cleanupStaleJobs();

    // Start periodic cleanup of old completed jobs
    this.scheduleCleanup();
  }

  private async cleanupStaleJobs() {
    try {
      // Remove all delayed polling jobs (from previous runs)
      const delayedJobs = await this.snapshotsQueue.getDelayed();
      for (const job of delayedJobs) {
        if (job.name === 'process_snapshots') {
          await job.remove();
          this.logger.log(`Removed stale delayed job: ${job.id}`);
        }
      }

      // Remove all waiting polling jobs
      const waitingJobs = await this.snapshotsQueue.getWaiting();
      for (const job of waitingJobs) {
        if (job.name === 'process_snapshots') {
          await job.remove();
          this.logger.log(`Removed stale waiting job: ${job.id}`);
        }
      }

      this.logger.log('Cleaned up stale jobs from previous runs');
    } catch (error) {
      this.logger.error(
        `Failed to clean up stale jobs: ${error.message}`,
        error.stack,
      );
    }
  }

  private scheduleCleanup() {
    setInterval(async () => {
      try {
        // Clean up completed polling jobs older than retention period
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

  @Process('process_snapshots')
  async handleProcessSnapshots(job: Job) {
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
        await (job.queue as any).add('process_snapshot', snapshot, {
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
      // Robust loop continuation with fallback mechanism
      await this.scheduleNextPoll(job.queue);
    }
  }

  /**
   * Ensures the polling loop continues even if queue operations fail.
   * Uses timestamp-based jobId to prevent race conditions with removeOnComplete.
   */
  private async scheduleNextPoll(queue: Queue) {
    try {
      // Use timestamp to create unique jobId and avoid race condition
      const jobId = `snapshot-poll-${Date.now()}`;

      await queue.add(
        'process_snapshots',
        {},
        {
          jobId,
          delay: this.POLL_DELAY,
          // Don't remove completed jobs so we can track polling history
        },
      );
      // Reset failure count on success
      this.loopFailureCount = 0;
    } catch (error) {
      this.loopFailureCount++;
      this.logger.error(
        `Failed to schedule next poll (attempt ${this.loopFailureCount}): ${error.message}`,
        error.stack,
      );

      // Fallback: Use setTimeout to restart the loop after delay
      // This ensures the loop continues even if Redis is temporarily down
      if (this.loopFailureCount >= this.MAX_LOOP_FAILURES) {
        this.logger.warn(
          'Queue scheduling failed multiple times. Using setTimeout fallback to restart loop.',
        );
      }

      // Always use setTimeout fallback on failure to ensure loop continues
      setTimeout(async () => {
        try {
          const fallbackJobId = `snapshot-poll-${Date.now()}`;
          await this.snapshotsQueue.add(
            'process_snapshots',
            {},
            {
              jobId: fallbackJobId,
              // Don't remove completed jobs so we can track polling history
            },
          );
          this.loopFailureCount = 0;
          this.logger.log('Successfully scheduled next poll via fallback');
        } catch (fallbackError) {
          this.logger.error(
            `Fallback scheduling failed: ${fallbackError.message}. Will retry on next cycle.`,
            fallbackError.stack,
          );
          // If this fails, the loop might stop, but health monitoring will detect it
        }
      }, this.POLL_DELAY);
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
