import { randomUUID } from 'crypto';
import BigNumber from 'bignumber.js';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import {
  MixinApi,
  SafeSnapshot,
  KeystoreClientReturnType,
  buildSafeTransactionRecipient,
  Keystore,
  getTotalBalanceFromOutputs,
  getUnspentOutputsForRecipients,
  buildSafeTransaction,
  encodeSafeTransaction,
  signSafeTransaction,
  SequencerTransactionRequest,
} from '@mixin.dev/mixin-node-sdk';
import { SnapshotsRepository } from './snapshots.repository';
import { decodeSpotMemo } from 'src/common/helpers/mixin/memo';

@Injectable()
export class SnapshotsService {
  private events: EventEmitter2;
  private keystore: Keystore;
  private client: KeystoreClientReturnType;
  private readonly logger = new Logger(SnapshotsService.name);

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private snapshotsRepository: SnapshotsRepository,
  ) {
    this.keystore = {
      app_id: this.configService.get<string>('mixin.app_id'),
      session_id: this.configService.get<string>('mixin.session_id'),
      server_public_key: this.configService.get<string>(
        'mixin.server_public_key',
      ),
      session_private_key: this.configService.get<string>(
        'mixin.session_private_key',
      ),
    };
    this.client = MixinApi({
      keystore: this.keystore,
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
      this.logger.error(`Failed to fetch snapshots: ${error}`);
    }
  }

  async sendMixinTx(
    opponent_id: string,
    asset_id: string,
    amount: string,
  ): Promise<SequencerTransactionRequest[]> {
    const recipients = [
      buildSafeTransactionRecipient([opponent_id], 1, amount),
    ];
    const outputs = await this.client.utxo.safeOutputs({
      members: [this.keystore.app_id],
      threshold: 1,
      asset: asset_id,
      state: 'unspent',
    });

    const balance = getTotalBalanceFromOutputs(outputs);
    const amountBN = BigNumber(amount);
    if (balance.isLessThan(amountBN)) {
      this.logger.error(`Insufficient fund`);
      return;
    }

    const { utxos, change } = getUnspentOutputsForRecipients(
      outputs,
      recipients,
    );
    if (!change.isZero() && !change.isNegative()) {
      recipients.push(
        buildSafeTransactionRecipient(
          outputs[0].receivers,
          outputs[0].receivers_threshold,
          change.toString(),
        ),
      );
    }
    const ghosts = await this.client.utxo.ghostKey(
      recipients.map((r, i) => ({
        hint: randomUUID(),
        receivers: r.members,
        index: i,
      })),
    );
    const tx = buildSafeTransaction(utxos, recipients, ghosts, 'Refund');
    const raw = encodeSafeTransaction(tx);

    const request_id = randomUUID();
    const verifiedTx = await this.client.utxo.verifyTransaction([
      {
        raw,
        request_id,
      },
    ]);

    const signedRaw = signSafeTransaction(
      tx,
      verifiedTx[0].views,
      this.keystore.session_private_key,
    );

    const sendedTx = await this.client.utxo.sendTransactions([
      {
        raw: signedRaw,
        request_id,
      },
    ]);
    return sendedTx;
  }

  async refund(snapshot: SafeSnapshot) {
    try {
      await this.sendMixinTx(
        snapshot.opponent_id,
        snapshot.asset_id,
        snapshot.amount,
      );
    } catch (error) {
      this.logger.error(`Failed to refund snapshot: ${error}`);
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
      // Snapshot processed
      return;
    }
    if (!snapshot.memo) {
      this.refund(snapshot);
      return;
    }
    if (snapshot.memo.length === 0) {
      this.refund(snapshot);
      return;
    }

    const tradingType = snapshot.memo.slice(0, 2);
    switch (tradingType) {
      case 'SP':
        const details = decodeSpotMemo(snapshot.memo);
        // Emit spot event
        break;

      default:
        // Refund
        break;
    }
    this.snapshotsRepository.createSnapshot(snapshot);
  }

  // Every minute at 0 second
  @Cron('0 * * * * *')
  async handleSnapshots(): Promise<void> {
    this.logger.debug('Called when the current second is 45');
  }
}
