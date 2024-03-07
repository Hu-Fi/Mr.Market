import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import {
  MixinApi,
  SafeSnapshot,
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';
import { SnapshotsRepository } from './snapshots.repository';
import { decodeSpotMemo, decodeSwapMemo } from 'src/common/helpers/mixin/memo';

@Injectable()
export class SnapshotsService {
  private events: EventEmitter2;
  private client: KeystoreClientReturnType;
  private readonly logger = new Logger(SnapshotsService.name);

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private snapshotsRepository: SnapshotsRepository,
  ) {
    this.client = MixinApi({
      keystore: {
        app_id: this.configService.get<string>('mixin.app_id'),
        session_id: this.configService.get<string>('mixin.session_id'),
        server_public_key: this.configService.get<string>(
          'mixin.server_public_key',
        ),
        session_private_key: this.configService.get<string>(
          'mixin.session_private_key',
        ),
      },
    });
    this.events = eventEmitter;
  }

  async fetchAndProcessSnapshots() {
    try {
      const snapshots = await this.client.safe.fetchSafeSnapshots({});
      if (!snapshots) {
        return;
      }
      snapshots.forEach((snapshot: SafeSnapshot) => {
        this.handleSnapshot(snapshot);
      });
      return snapshots;
    } catch (error) {
      this.logger.error('Failed to fetch snapshots', error);
    }
  }

  private async handleSnapshot(snapshot: SafeSnapshot) {
    // 1. Create if snapshot doesn't exist
    // 2. Decode memo, refund if memo format check failed
    // 3. Emit event based on memo format
    const s = await this.snapshotsRepository.findSnapshotsByID(
      snapshot.snapshot_id,
    );
    if (s) {
      // Snapshot processed already
      return;
    }
    this.snapshotsRepository.createSnapshot(snapshot);

    if (!snapshot.memo) {
      // Refund
    }
    const tradingType = snapshot.memo.slice(0, 2);
    switch (tradingType) {
      case 'SP':
        const details = decodeSpotMemo(snapshot.memo);
        console.log(details);
        // Emit spot event
        break;

      default:
        // Refund
        break;
    }
    this.logger.log(`snapshots: ${s}`);
  }

  // Every minute at 0 second
  @Cron('0 * * * * *')
  async handleSnapshots(): Promise<void> {
    this.logger.debug('Called when the current second is 45');
  }
}
