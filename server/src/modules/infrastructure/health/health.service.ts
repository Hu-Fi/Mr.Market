import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CustomLogger } from '../logger/logger.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ExchangeInitService } from '../exchange-init/exchange-init.service';

type HEALTH_STATE = 'alive' | 'dead';

@Injectable()
export class HealthService {
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new CustomLogger(HealthService.name);

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectQueue('snapshots') private snapshotsQueue: Queue,
    private exchangeInitService: ExchangeInitService,
  ) {
    // Enable this with api keys in .env
    // this.checkApiKeys()
  }

  private checkApiKeys() {
    if (!process.env.BITFINEX_API_KEY || !process.env.BITFINEX_SECRET) {
      throw new InternalServerErrorException(
        `Bitfinex API key or Secret is invalid`,
      );
    }
    if (!process.env.MEXC_API_KEY || !process.env.MEXC_SECRET) {
      throw new InternalServerErrorException(
        `MEXC API key or Secret is invalid`,
      );
    }
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET) {
      throw new InternalServerErrorException(
        `Binance API key or Secret is invalid`,
      );
    }
  }

  async ping(): Promise<string> {
    return 'pong';
  }

  async getAllHealth(): Promise<any> {
    const healthMap = new Map<string, string>();
    const allExchanges = Array.from(this.exchanges.values());
    // Get balance from each exchange to test if API key is valid
    const allRequests = [];
    for (let i = 0; i < allExchanges.length; i++) {
      try {
        allRequests.push(allExchanges[i].fetchBalance());
      } catch (e) {
        healthMap.set(allExchanges[i].name, 'dead' as HEALTH_STATE);
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      }
    }

    const responses = await Promise.all(allRequests);
    for (let i = 0; i < responses.length; i++) {
      if (!responses[i]) {
        // there is no field like balance in responses[i]
        healthMap.set(allExchanges[i].name, 'dead' as HEALTH_STATE);
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      } else {
        healthMap.set(allExchanges[i].name, 'alive' as HEALTH_STATE);
      }
    }

    const result = Array.from(healthMap, ([key, value]) => ({ [key]: value }));
    if (result.length === 0) {
      throw new InternalServerErrorException(`Exchanges are all dead`);
    }
    return result;
  }

  async getExchangeHealth(exchangeName: string): Promise<any> {
    const exchange = this.exchangeInitService.getExchange(exchangeName);
    if (!exchange) {
      throw new BadRequestException(
        'Exchange not found, use GET /strategy/supported-exchanges to get supported exchanges',
      );
    }
    const balance = await exchange.fetchBalance();
    if (!balance) {
      throw new InternalServerErrorException(
        `Exchange ${exchange.name} is dead`,
      );
    }
    return { statusCode: 200, message: 'alive' as HEALTH_STATE };
  }

  /**
   * Check snapshot polling queue health
   * Monitors queue status, job counts, and detects if polling loop is running
   */
  async checkSnapshotPollingHealth(): Promise<any> {
    try {
      const [
        waitingCount,
        activeCount,
        completedCount,
        failedCount,
        delayedCount,
        isPaused,
        delayedJobs,
        activeJobs,
        failedJobs,
        completedJobs,
      ] = await Promise.all([
        this.snapshotsQueue.getWaitingCount(),
        this.snapshotsQueue.getActiveCount(),
        this.snapshotsQueue.getCompletedCount(),
        this.snapshotsQueue.getFailedCount(),
        this.snapshotsQueue.getDelayedCount(),
        this.snapshotsQueue.isPaused(),
        this.snapshotsQueue.getDelayed(),
        this.snapshotsQueue.getActive(),
        this.snapshotsQueue.getFailed(0, 10), // Get last 10 failed jobs
        this.snapshotsQueue.getCompleted(0, 5), // Get last 5 completed jobs
      ]);

      // Check if polling loop is running by looking for:
      // 1. Delayed polling job (scheduled for next run)
      // 2. Active polling job (currently running)
      // 3. Recently completed polling job (within last 10 seconds)
      const now = Date.now();
      const delayedPollingJob = delayedJobs.find(
        (job) => job.name === 'process_snapshots',
      );
      const activePollingJob = activeJobs.find(
        (job) => job.name === 'process_snapshots',
      );
      const recentlyCompletedPollingJob = completedJobs.find(
        (job) =>
          job.name === 'process_snapshots' &&
          job.finishedOn &&
          now - job.finishedOn < 10000, // Within last 10 seconds
      );

      const isPollingActive =
        !!delayedPollingJob ||
        !!activePollingJob ||
        !!recentlyCompletedPollingJob;

      const nextPollJob = delayedPollingJob || recentlyCompletedPollingJob;

      // Detect issues
      const issues: string[] = [];
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';

      if (isPaused) {
        issues.push('Queue is paused');
        status = 'critical';
      }

      if (!isPollingActive && activeCount === 0) {
        issues.push('Polling loop appears to have stopped');
        status = 'critical';
      }

      if (failedCount > 100) {
        issues.push(`High failure rate: ${failedCount} failed jobs`);
        status = status === 'critical' ? 'critical' : 'warning';
      }

      if (waitingCount > 1000) {
        issues.push(`Large backlog: ${waitingCount} waiting jobs`);
        status = status === 'critical' ? 'critical' : 'warning';
      }

      if (activeCount === 0 && waitingCount > 0) {
        issues.push('No active workers processing waiting jobs');
        status = 'critical';
      }

      // Recent failures analysis
      const recentFailures = failedJobs.map((job) => ({
        id: job.id,
        name: job.name,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
        data:
          job.name === 'process_snapshot'
            ? { snapshot_id: job.data?.snapshot_id }
            : undefined,
      }));

      // Map recently completed polling jobs for visibility
      const recentlyCompletedPollingJobs = completedJobs
        .filter((job) => job.name === 'process_snapshots')
        .map((job) => ({
          id: job.id,
          name: job.name,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
        }));

      return {
        status,
        healthy: status === 'healthy',
        timestamp: new Date().toISOString(),
        queue: {
          name: 'snapshots',
          isPaused,
          isPollingActive,
          nextPollJob: nextPollJob
            ? {
              id: nextPollJob.id,
              delay: nextPollJob.opts?.delay,
              timestamp: nextPollJob.timestamp,
              finishedOn: nextPollJob.finishedOn,
            }
            : null,
        },
        metrics: {
          waiting: waitingCount,
          active: activeCount,
          completed: completedCount,
          failed: failedCount,
          delayed: delayedCount,
        },
        activeJobs: activeJobs.map((job) => ({
          id: job.id,
          name: job.name,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
        })),
        recentlyCompletedJobs: recentlyCompletedPollingJobs.length > 0
          ? recentlyCompletedPollingJobs
          : undefined,
        issues,
        recentFailures: recentFailures.length > 0 ? recentFailures : undefined,
      };
    } catch (error) {
      this.logger.error(
        `Failed to check snapshot polling health: ${error.message}`,
        error.stack,
      );
      return {
        status: 'critical',
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error.message,
        issues: ['Failed to retrieve queue status'],
      };
    }
  }
}

