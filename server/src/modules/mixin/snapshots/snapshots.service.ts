import { ConfigService } from '@nestjs/config';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

import {
  memoPreDecode,
  decodeMarketMakingCreateMemo,
  decodeSimplyGrowCreateMemo,
} from 'src/common/helpers/mixin/memo';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MixinClientService } from '../client/mixin-client.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class SnapshotsService implements OnApplicationBootstrap {
  private events: EventEmitter2;
  private readonly logger = new CustomLogger(SnapshotsService.name);
  private readonly enableCron: boolean;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectQueue('snapshots') private snapshotsQueue: Queue,
    @InjectQueue('market-making') private marketMakingQueue: Queue,
    private mixinClientService: MixinClientService,
    private transactionService: TransactionService,
  ) {
    this.events = this.eventEmitter;

    this.enableCron =
      this.configService.get<string>('strategy.mixin_snapshots_run') === 'true';
    this.logger.debug(`Snapshots service enable cron: ${this.enableCron}`);
  }

  async onApplicationBootstrap() {
    await this.startSnapshotLoop();
  }

  async fetchSnapshotsOnly(): Promise<SafeSnapshot[]> {
    try {
      const redis = (this.snapshotsQueue as any).client;
      const cursor = await redis.get('snapshots:cursor');
      const offset = cursor || '';

      const snapshots =
        await this.mixinClientService.client.safe.fetchSafeSnapshots({
          offset,
        } as any);

      if (!snapshots || snapshots.length === 0) {
        return [];
      }

      return snapshots;
    } catch (error) {
      this.logger.error(`Failed to fetch snapshots: ${error}`);
      return [];
    }
  }

  async getSnapshotCursor(): Promise<string> {
    try {
      const redis = (this.snapshotsQueue as any).client;
      const cursor = await redis.get('snapshots:cursor');
      return cursor || '';
    } catch (error) {
      this.logger.error(`Failed to get snapshot cursor: ${error}`);
      return '';
    }
  }

  async updateSnapshotCursor(timestamp: string) {
    try {
      const redis = (this.snapshotsQueue as any).client;
      await redis.set('snapshots:cursor', timestamp);
    } catch (error) {
      this.logger.error(`Failed to update snapshot cursor: ${error}`);
    }
  }

  async handleSnapshot(snapshot: SafeSnapshot) {
    this.logger.log(
      `[Service] handleSnapshot() called for snapshot: ${snapshot.snapshot_id}`,
    );
    this.logger.debug(
      `[Service] Snapshot details: ${JSON.stringify(snapshot)}`,
    );
    const amountValue = Number(snapshot.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return;
    }
    if (!snapshot.memo) {
      this.logger.warn('snapshot no memo, return');
      return;
    }
    if (snapshot.memo.length === 0) {
      this.logger.warn('snapshot.memo.length === 0, return');
      return;
    }
    try {
      this.logger.log(`handleSnapshot()=> snapshot.memo: ${snapshot.memo}`);
      // Hex and Base58 decode memo, verify checksum, refund if invalid
      const hexDecodedMemo = Buffer.from(snapshot.memo, 'hex').toString(
        'utf-8',
      );
      const { payload, version, tradingTypeKey } = memoPreDecode(hexDecodedMemo);
      if (!payload) {
        this.logger.log(
          `Snapshot memo is invalid, refund: ${snapshot.snapshot_id}`,
        );
        await this.transactionService.refund(snapshot);
        return;
      }

      // Only memo version 1 is supported
      if (version !== 1) {
        this.logger.log(
          `Snapshot memo version is not 1, refund: ${snapshot.snapshot_id}`,
        );
        await this.transactionService.refund(snapshot);
        return;
      }

      switch (tradingTypeKey) {
        case 0:
          // Spot trading
          break;
        case 1:
          // Market making - Queue for processing instead of emitting event
          const mmDetails = decodeMarketMakingCreateMemo(payload);
          if (!mmDetails) {
            this.logger.warn('Failed to decode market making memo, refunding');
            await this.transactionService.refund(snapshot);
            break;
          }
          // Queue the snapshot for market making processing
          await this.marketMakingQueue.add(
            'process_mm_snapshot',
            {
              snapshotId: snapshot.snapshot_id,
              orderId: mmDetails.orderId,
              marketMakingPairId: mmDetails.marketMakingPairId,
              memoDetails: mmDetails,
              snapshot,
            },
            {
              jobId: `mm_snapshot_${snapshot.snapshot_id}`,
              attempts: 3,
              backoff: { type: 'exponential', delay: 5000 },
              removeOnComplete: false, // Keep for debugging
            },
          );
          this.logger.log(
            `Queued market making snapshot ${snapshot.snapshot_id} for order ${mmDetails.orderId}`,
          );
          break;
        case 2:
          // Simply grow
          const simplyGrowDetails = decodeSimplyGrowCreateMemo(payload);
          if (!simplyGrowDetails) {
            break;
          }
          this.events.emit('simply_grow.create', simplyGrowDetails, snapshot);
          break;
        default:
          // Refund
          this.logger.log(
            `Snapshot memo trading type is not supported, refund: ${snapshot.snapshot_id}`,
          );
          await this.transactionService.refund(snapshot);
          break;
      }
    } catch (error) {
      this.logger.error(`handleSnapshot()=> ${error}`);
    }
  }

  // startSnapshotLoop() -> handlePollSnapshots() -> fetchSnapshotsOnly() -> handleSnapshot()
  async startSnapshotLoop() {
    this.logger.log(
      `startSnapshotLoop() called. enableCron=${this.enableCron}`,
    );
    if (this.enableCron) {
      this.logger.log(
        'Snapshot polling is ENABLED. Starting snapshot polling loop via Bull...',
      );
      try {
        const jobId = `snapshot-poll-${Date.now()}`;
        await this.snapshotsQueue.add(
          'process_snapshots',
          {},
          {
            jobId,
            // Don't remove completed jobs so we can track polling history
          },
        );
        this.logger.log(
          `Successfully queued initial snapshot polling job: ${jobId}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to start snapshot polling loop: ${error.message}`,
          error.stack,
        );
      }
    } else {
      this.logger.warn(
        'Snapshot polling is DISABLED (RUN_MIXIN_SNAPSHOTS is not set to true)',
      );
    }
  }
}
