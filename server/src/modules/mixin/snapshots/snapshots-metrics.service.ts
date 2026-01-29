import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Optional metrics service for advanced queue health monitoring.
 * Provides periodic health checks and metrics collection.
 */
@Injectable()
export class SnapshotsMetricsService {
  private readonly logger = new Logger(SnapshotsMetricsService.name);

  constructor(
    @InjectQueue('snapshots') private readonly snapshotsQueue: Queue,
  ) {}

  /**
   * Periodic health check that runs every minute
   * Reports queue metrics to help identify issues early
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkQueueHealth() {
    try {
      const [
        waitingCount,
        activeCount,
        completedCount,
        failedCount,
        delayedCount,
      ] = await Promise.all([
        this.snapshotsQueue.getWaitingCount(),
        this.snapshotsQueue.getActiveCount(),
        this.snapshotsQueue.getCompletedCount(),
        this.snapshotsQueue.getFailedCount(),
        this.snapshotsQueue.getDelayedCount(),
      ]);

      // Log metrics (in production, you'd send these to a monitoring service)
      this.logger.debug(
        `Queue Health - Waiting: ${waitingCount}, Active: ${activeCount}, ` +
          `Completed: ${completedCount}, Failed: ${failedCount}, Delayed: ${delayedCount}`,
      );

      // Alert on concerning patterns
      if (failedCount > 100) {
        this.logger.warn(
          `High number of failed jobs detected: ${failedCount}. Investigation recommended.`,
        );
      }

      if (waitingCount > 1000) {
        this.logger.warn(
          `Queue backlog detected: ${waitingCount} jobs waiting. Consider scaling workers.`,
        );
      }

      if (activeCount === 0 && waitingCount > 0) {
        this.logger.error(
          `No active workers but jobs are waiting! Worker may have crashed.`,
        );
      }

      const lastPoll = await this.getLastPollTimestamp();
      if (!lastPoll) {
        this.logger.warn('Snapshot polling has not reported a last poll time.');
      } else if (Date.now() - lastPoll > 30000) {
        this.logger.error(
          'Snapshot polling appears stale (last poll > 30s ago).',
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to check queue health: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Get detailed queue metrics for debugging
   */
  async getQueueMetrics() {
    try {
      const [waiting, active, completed, failed, delayed, paused] =
        await Promise.all([
          this.snapshotsQueue.getWaiting(),
          this.snapshotsQueue.getActive(),
          this.snapshotsQueue.getCompleted(),
          this.snapshotsQueue.getFailed(),
          this.snapshotsQueue.getDelayed(),
          this.snapshotsQueue.isPaused(),
        ]);

      return {
        counts: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
          delayed: delayed.length,
        },
        isPaused: paused,
        jobs: {
          waiting: waiting.map((j) => ({
            id: j.id,
            name: j.name,
            timestamp: j.timestamp,
          })),
          active: active.map((j) => ({
            id: j.id,
            name: j.name,
            timestamp: j.timestamp,
          })),
          failed: failed.map((j) => ({
            id: j.id,
            name: j.name,
            failedReason: j.failedReason,
            attemptsMade: j.attemptsMade,
          })),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get queue metrics: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Clean up old completed and failed jobs
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldJobs() {
    try {
      // Keep jobs for 7 days
      const gracePeriod = 7 * 24 * 60 * 60 * 1000;

      await this.snapshotsQueue.clean(gracePeriod, 'completed');
      await this.snapshotsQueue.clean(gracePeriod, 'failed');

      this.logger.log('Completed periodic job cleanup');
    } catch (error) {
      this.logger.error(
        `Failed to clean up old jobs: ${error.message}`,
        error.stack,
      );
    }
  }

  private async getLastPollTimestamp(): Promise<number | null> {
    try {
      const redis = (this.snapshotsQueue as any).client;
      const lastPoll = await redis.get('snapshots:last_poll');
      if (!lastPoll) {
        return null;
      }

      const parsed = Number(lastPoll);
      return Number.isFinite(parsed) ? parsed : null;
    } catch (error) {
      this.logger.error(
        `Failed to get last poll timestamp: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Get health status summary
   */
  async getHealthStatus(): Promise<{
    healthy: boolean;
    issues: string[];
    metrics: any;
  }> {
    const issues: string[] = [];
    const metrics = await this.getQueueMetrics();

    if (!metrics) {
      return {
        healthy: false,
        issues: ['Failed to retrieve queue metrics'],
        metrics: null,
      };
    }

    // Check for issues
    if (metrics.counts.failed > 50) {
      issues.push(`High failure rate: ${metrics.counts.failed} failed jobs`);
    }

    if (metrics.counts.waiting > 500) {
      issues.push(`Large backlog: ${metrics.counts.waiting} waiting jobs`);
    }

    if (metrics.isPaused) {
      issues.push('Queue is paused');
    }

    if (metrics.counts.active === 0 && metrics.counts.waiting > 0) {
      issues.push('No active workers processing waiting jobs');
    }

    return {
      healthy: issues.length === 0,
      issues,
      metrics,
    };
  }
}
