import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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
  ) { }

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
