import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import {
  MixinApi,
  SafeSnapshot,
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';

@Injectable()
export class SnapshotsService {
  private client: KeystoreClientReturnType;
  private readonly logger = new Logger(SnapshotsService.name);

  constructor(private configService: ConfigService) {
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
  }

  async fetchAndProcessSnapshots() {
    try {
      const snapshots = await this.client.safe.fetchSafeSnapshots({});
      snapshots.forEach((snapshot: SafeSnapshot) => {
        this.handleMemo(snapshot);
      });
    } catch (error) {
      this.logger.error('Failed to fetch snapshots', error);
    }
  }

  private handleMemo(snapshot: SafeSnapshot) {}

  // Every minute at 0 second
  @Cron('0 * * * * *')
  async handleSnapshots(): Promise<void> {
    this.logger.debug('Called when the current second is 45');
  }
}
