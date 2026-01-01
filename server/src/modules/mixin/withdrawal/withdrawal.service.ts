import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { SafeSnapshot, SequencerTransactionRequest } from '@mixin.dev/mixin-node-sdk';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MixinClientService } from '../client/mixin-client.service';
import { randomUUID } from 'crypto';
import {
  buildSafeTransactionRecipient,
  getUnspentOutputsForRecipients,
  buildSafeTransaction,
  encodeSafeTransaction,
  signSafeTransaction,
  blake3Hash,
  MixinCashier,
  SafeWithdrawalRecipient,
  SafeMixinRecipient,
} from '@mixin.dev/mixin-node-sdk';

export interface WithdrawalMemoDetails {
  version: number;
  tradingType: string;
  destination: string;
  destinationTag?: string;
  assetId: string;
  amount: string;
}

@Injectable()
export class WithdrawalService {
  private readonly logger = new CustomLogger(WithdrawalService.name);

  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    @InjectQueue('withdrawals') private withdrawalQueue: Queue,
    private mixinClientService: MixinClientService,
  ) { }

  /**
   * Execute withdrawal to blockchain address
   * Moved from SnapshotsService for better separation of concerns
   */
  async executeWithdrawal(
    asset_id: string,
    destination: string,
    memo: string,
    amount: string,
  ): Promise<SequencerTransactionRequest[]> {
    const client = this.mixinClientService.client;
    const spendKey = this.mixinClientService.spendKey;

    const asset = await client.network.fetchAsset(asset_id);
    const chain =
      asset.chain_id === asset.asset_id
        ? asset
        : await client.network.fetchAsset(asset.chain_id);
    const fee = chain;
    this.logger.log(`Withdrawal Fee: ${fee.amount} ${fee.symbol}`);

    // withdrawal with chain asset as fee
    if (fee.asset_id !== asset.asset_id) {
      const outputs = await client.utxo.safeOutputs({
        asset: asset_id,
        state: 'unspent',
      });
      const feeOutputs = await client.utxo.safeOutputs({
        asset: fee.asset_id,
        state: 'unspent',
      });

      const recipients: (SafeWithdrawalRecipient | SafeMixinRecipient)[] = [
        {
          amount: amount,
          destination: destination,
        },
      ];
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
      // the index of ghost keys must be the same with the index of outputs
      // but withdrawal output doesnt need ghost key, so index + 1
      const ghosts = await client.utxo.ghostKey(
        recipients,
        randomUUID(),
        spendKey,
      );
      const tx = buildSafeTransaction(
        utxos,
        recipients,
        ghosts,
        Buffer.from(memo),
      );
      const raw = encodeSafeTransaction(tx);
      const ref = blake3Hash(Buffer.from(raw, 'hex')).toString('hex');

      const feeRecipients = [
        // fee output
        buildSafeTransactionRecipient([MixinCashier], 1, fee.amount),
      ];
      const { utxos: feeUtxos, change: feeChange } =
        getUnspentOutputsForRecipients(feeOutputs, feeRecipients);
      if (!feeChange.isZero() && !feeChange.isNegative()) {
        // add fee change output if needed
        feeRecipients.push(
          buildSafeTransactionRecipient(
            feeOutputs[0].receivers,
            feeOutputs[0].receivers_threshold,
            feeChange.toString(),
          ),
        );
      }
      const feeGhosts = await client.utxo.ghostKey(
        feeRecipients,
        randomUUID(),
        spendKey,
      );
      const feeTx = buildSafeTransaction(
        feeUtxos,
        feeRecipients,
        feeGhosts,
        Buffer.from('withdrawal-fee-memo'),
        [ref],
      );
      const feeRaw = encodeSafeTransaction(feeTx);

      const txId = randomUUID();
      const feeId = randomUUID();
      const txs = await client.utxo.verifyTransaction([
        {
          raw,
          request_id: txId,
        },
        {
          raw: feeRaw,
          request_id: feeId,
        },
      ]);

      const signedRaw = signSafeTransaction(tx, txs[0].views, spendKey);
      const signedFeeRaw = signSafeTransaction(
        feeTx,
        txs[1].views,
        spendKey,
      );
      const res = await client.utxo.sendTransactions([
        {
          raw: signedRaw,
          request_id: txId,
        },
        {
          raw: signedFeeRaw,
          request_id: feeId,
        },
      ]);
      this.logger.log(`Withdrawal result: ${JSON.stringify(res)}`);
      return res;
    }
    // withdrawal with asset as fee
    else {
      const outputs = await client.utxo.safeOutputs({
        asset: asset_id,
        state: 'unspent',
      });

      const recipients = [
        // withdrawal output, must be put first
        {
          amount: amount,
          destination: destination,
        },
        // fee output
        buildSafeTransactionRecipient([MixinCashier], 1, fee.amount),
      ];
      const { utxos, change } = getUnspentOutputsForRecipients(
        outputs,
        recipients,
      );
      if (!change.isZero() && !change.isNegative()) {
        // add change output if needed
        recipients.push(
          buildSafeTransactionRecipient(
            outputs[0].receivers,
            outputs[0].receivers_threshold,
            change.toString(),
          ),
        );
      }
      // the index of ghost keys must be the same with the index of outputs
      // but withdrawal output doesnt need ghost key, so index + 1
      const ghosts = await client.utxo.ghostKey(
        recipients,
        randomUUID(),
        spendKey,
      );
      // spare the 0 inedx for withdrawal output, withdrawal output doesnt need ghost key
      const tx = buildSafeTransaction(
        utxos,
        recipients,
        ghosts,
        Buffer.from('withdrawal-memo'),
      );
      const raw = encodeSafeTransaction(tx);

      const request_id = randomUUID();
      const txs = await client.utxo.verifyTransaction([
        {
          raw,
          request_id,
        },
      ]);

      const signedRaw = signSafeTransaction(tx, txs[0].views, spendKey);
      const res = await client.utxo.sendTransactions([
        {
          raw: signedRaw,
          request_id,
        },
      ]);
      this.logger.log(`Withdrawal result: ${JSON.stringify(res)}`);
      return res;
    }
  }

  /**
   * Initialize withdrawal from snapshot
   * This is called when a valid withdrawal memo is detected in a snapshot
   */
  async initializeWithdrawal(
    snapshot: SafeSnapshot,
    memoDetails: WithdrawalMemoDetails,
  ): Promise<Withdrawal | null> {
    try {
      // Check if withdrawal for this snapshot already exists (prevent double processing)
      const existingWithdrawal = await this.withdrawalRepository.findOne({
        where: { snapshotId: snapshot.snapshot_id },
      });

      if (existingWithdrawal) {
        this.logger.warn(
          `Withdrawal already exists for snapshot ${snapshot.snapshot_id}`,
        );
        return existingWithdrawal;
      }

      // Create withdrawal record
      const withdrawal = this.withdrawalRepository.create({
        snapshotId: snapshot.snapshot_id,
        userId: snapshot.opponent_id,
        opponentId: snapshot.opponent_id,
        amount: parseFloat(snapshot.amount),
        assetId: snapshot.asset_id,
        symbol: memoDetails.assetId, // This should be fetched from asset details
        memo: snapshot.memo,
        memoVersion: memoDetails.version,
        tradingType: memoDetails.tradingType,
        destination: memoDetails.destination,
        destinationTag: memoDetails.destinationTag,
        type: 'withdraw_to_address',
        status: 'pending',
      });

      const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);
      this.logger.log(
        `Initialized withdrawal ${savedWithdrawal.id} for snapshot ${snapshot.snapshot_id}`,
      );

      // Queue withdrawal for processing
      await this.queueWithdrawal(savedWithdrawal.id);

      return savedWithdrawal;
    } catch (error) {
      this.logger.error(
        `Failed to initialize withdrawal from snapshot ${snapshot.snapshot_id}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Queue withdrawal for processing
   */
  async queueWithdrawal(withdrawalId: string): Promise<void> {
    try {
      await this.withdrawalQueue.add(
        'process_withdrawal',
        { withdrawalId },
        {
          jobId: withdrawalId,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: true,
        },
      );

      // Update status to queued
      await this.withdrawalRepository.update(withdrawalId, {
        status: 'queued',
      });

      this.logger.log(`Queued withdrawal ${withdrawalId} for processing`);
    } catch (error) {
      this.logger.error(
        `Failed to queue withdrawal ${withdrawalId}: ${error.message}`,
      );
    }
  }

  /**
   * Get withdrawal by ID
   */
  async getWithdrawalById(id: string): Promise<Withdrawal | null> {
    return this.withdrawalRepository.findOne({ where: { id } });
  }

  /**
   * Update withdrawal status
   */
  async updateWithdrawalStatus(
    id: string,
    status: string,
    additionalData?: Partial<Withdrawal>,
  ): Promise<void> {
    await this.withdrawalRepository.update(id, {
      status,
      ...additionalData,
    });
  }

  /**
   * Get pending withdrawals for confirmation worker
   */
  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return this.withdrawalRepository.find({
      where: [
        { status: 'processing' },
        { status: 'sent' },
        { status: 'confirmed' },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Mark withdrawal as failed
   */
  async markAsFailed(id: string, errorMessage: string): Promise<void> {
    await this.withdrawalRepository.update(id, {
      status: 'failed',
      errorMessage,
    });
    this.logger.error(`Withdrawal ${id} marked as failed: ${errorMessage}`);
  }

  /**
   * Mark withdrawal as refunded
   */
  async markAsRefunded(id: string, mixinTxId: string): Promise<void> {
    await this.withdrawalRepository.update(id, {
      status: 'refunded',
      mixinTxId,
    });
    this.logger.log(`Withdrawal ${id} marked as refunded, txId: ${mixinTxId}`);
  }

  /**
   * Increment retry count
   */
  async incrementRetryCount(id: string): Promise<void> {
    const withdrawal = await this.getWithdrawalById(id);
    if (withdrawal) {
      await this.withdrawalRepository.update(id, {
        retryCount: withdrawal.retryCount + 1,
      });
    }
  }

  /**
   * Update last checked timestamp
   */
  async updateLastChecked(id: string): Promise<void> {
    await this.withdrawalRepository.update(id, {
      lastCheckedAt: new Date(),
    });
  }
}
