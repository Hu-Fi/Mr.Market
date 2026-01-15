import { Job } from 'bull';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Process, Processor } from '@nestjs/bull';
import { WithdrawalService } from './withdrawal.service';
import { SnapshotsService } from '../snapshots/snapshots.service';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Processor('withdrawals')
export class WithdrawalProcessor {
  private readonly logger = new CustomLogger(WithdrawalProcessor.name);

  // In-memory set to track processing withdrawals (prevent concurrent processing)
  private processingWithdrawals = new Set<string>();

  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly snapshotsService: SnapshotsService,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
  ) { }

  @Process('process_withdrawal')
  async handleWithdrawal(job: Job<{ withdrawalId: string }>) {
    const { withdrawalId } = job.data;

    this.logger.log(`Processing withdrawal ${withdrawalId}...`);

    // Double-check: prevent concurrent processing of the same withdrawal
    if (this.processingWithdrawals.has(withdrawalId)) {
      this.logger.warn(
        `Withdrawal ${withdrawalId} is already being processed, skipping...`,
      );
      return;
    }

    try {
      // Add to processing set
      this.processingWithdrawals.add(withdrawalId);

      // Fetch withdrawal from database
      const withdrawal = await this.withdrawalService.getWithdrawalById(
        withdrawalId,
      );

      if (!withdrawal) {
        this.logger.error(`Withdrawal ${withdrawalId} not found`);
        return;
      }

      // Check if already processed (prevent double withdrawal)
      if (
        withdrawal.status === 'completed' ||
        withdrawal.status === 'refunded' ||
        withdrawal.status === 'sent' ||
        withdrawal.status === 'processing'
      ) {
        this.logger.warn(
          `Withdrawal ${withdrawalId} already in final or processing state: ${withdrawal.status}`,
        );
        return;
      }

      // Additional database-level check using atomic update
      const updateResult = await this.withdrawalRepository
        .createQueryBuilder()
        .update(Withdrawal)
        .set({ status: 'processing' })
        .where('id = :id', { id: withdrawalId })
        .andWhere('status IN (:...statuses)', {
          statuses: ['pending', 'queued'],
        })
        .execute();

      if (updateResult.affected === 0) {
        this.logger.warn(
          `Withdrawal ${withdrawalId} was already processed by another worker`,
        );
        return;
      }

      this.logger.log(
        `Starting withdrawal execution for ${withdrawalId}, destination: ${withdrawal.destination}`,
      );

      // Check balance before withdrawal
      const hasEnoughBalance =
        await this.snapshotsService.checkMixinBalanceEnough(
          withdrawal.assetId,
          withdrawal.amount.toString(),
        );

      if (!hasEnoughBalance) {
        await this.withdrawalService.markAsFailed(
          withdrawalId,
          'Insufficient balance',
        );
        this.logger.error(
          `Insufficient balance for withdrawal ${withdrawalId}`,
        );
        return;
      }

      // Execute withdrawal
      const result = await this.withdrawalService.executeWithdrawal(
        withdrawal.assetId,
        withdrawal.destination,
        withdrawal.destinationTag || '',
        withdrawal.amount.toString(),
      );

      if (result && result.length > 0) {
        // Extract transaction IDs
        const mixinTxId = result[0].request_id;

        // Update withdrawal with transaction details
        await this.withdrawalService.updateWithdrawalStatus(
          withdrawalId,
          'sent',
          {
            mixinTxId,
          },
        );

        this.logger.log(
          `Withdrawal ${withdrawalId} sent successfully, txId: ${mixinTxId}`,
        );
      } else {
        await this.withdrawalService.markAsFailed(
          withdrawalId,
          'Failed to send withdrawal transaction',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing withdrawal ${withdrawalId}: ${error.message}`,
        error.stack,
      );

      // Increment retry count
      await this.withdrawalService.incrementRetryCount(withdrawalId);

      // Mark as failed if max retries exceeded
      const withdrawal = await this.withdrawalService.getWithdrawalById(
        withdrawalId,
      );
      if (withdrawal && withdrawal.retryCount >= 3) {
        await this.withdrawalService.markAsFailed(
          withdrawalId,
          `Max retries exceeded: ${error.message}`,
        );
      } else {
        // Update status back to queued for retry
        await this.withdrawalService.updateWithdrawalStatus(
          withdrawalId,
          'queued',
        );
      }

      throw error; // Re-throw to let Bull handle retries
    } finally {
      // Remove from processing set
      this.processingWithdrawals.delete(withdrawalId);
    }
  }
}
