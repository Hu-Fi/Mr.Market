import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
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
export class SnapshotsService {
  private readonly logger = new CustomLogger(SnapshotsService.name);
  private readonly enableCron: boolean;

  constructor(
    private configService: ConfigService,
    @InjectQueue('snapshots') private snapshotsQueue: Queue,
    @InjectQueue('market-making') private marketMakingQueue: Queue,
    private mixinClientService: MixinClientService,
    private transactionService: TransactionService,
  ) {
    this.enableCron =
      this.configService.get<string>('strategy.mixin_snapshots_run') === 'true';
    this.logger.debug(`Snapshots service enable cron: ${this.enableCron}`);
  }

  async fetchSnapshots(): Promise<{
    snapshots: SafeSnapshot[];
    newSnapshots: SafeSnapshot[];
    newestTimestamp: string;
  }> {
    try {
      await this.updateLastPoll();
      const currentCursor = await this.getSnapshotCursor();
      const snapshots =
        await this.mixinClientService.client.safe.fetchSafeSnapshots({} as any);

      if (!snapshots || snapshots.length === 0) {
        return { snapshots: [], newSnapshots: [], newestTimestamp: '' };
      }

      const newSnapshots = currentCursor
        ? snapshots.filter((snapshot) => snapshot.created_at > currentCursor)
        : snapshots;

      if (newSnapshots.length === 0) {
        return { snapshots, newSnapshots: [], newestTimestamp: '' };
      }

      const newestTimestamp = newSnapshots.reduce(
        (max, snapshot) =>
          snapshot.created_at > max ? snapshot.created_at : max,
        newSnapshots[0].created_at,
      );

      await this.updateSnapshotCursor(newestTimestamp);

      return { snapshots, newSnapshots, newestTimestamp };
    } catch (error) {
      this.logger.error(`Failed to fetch snapshots: ${error}`);
      return { snapshots: [], newSnapshots: [], newestTimestamp: '' };
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

  async updateLastPoll() {
    try {
      const redis = (this.snapshotsQueue as any).client;
      await redis.set('snapshots:last_poll', Date.now().toString());
    } catch (error) {
      this.logger.error(`Failed to update last poll timestamp: ${error}`);
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
      const { payload, version, tradingTypeKey } =
        memoPreDecode(hexDecodedMemo);
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
          // Market making - Queue for processing
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

  isPollingEnabled() {
    return this.enableCron;
  }
}
