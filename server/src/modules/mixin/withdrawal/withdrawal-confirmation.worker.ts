import { Job, Queue } from 'bull';
import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { WithdrawalService } from './withdrawal.service';
import { MixinClientService } from '../client/mixin-client.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { UserOrdersService } from '../../market-making/user-orders/user-orders.service';

interface MonitorMMWithdrawalData {
  orderId: string;
  marketMakingPairId: string;
  baseWithdrawalTxId?: string;
  quoteWithdrawalTxId?: string;
}

@Processor('withdrawal-confirmations')
export class WithdrawalConfirmationWorker {
  private readonly logger = new CustomLogger(WithdrawalConfirmationWorker.name);

  // Maximum wait time for withdrawal confirmation: 30 minutes
  private readonly WITHDRAWAL_TIMEOUT_MS = 30 * 60 * 1000;
  // Retry interval: 30 seconds
  private readonly RETRY_DELAY_MS = 30000;

  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly mixinClientService: MixinClientService,
    @InjectQueue('market-making') private readonly marketMakingQueue: Queue,
    private readonly userOrdersService: UserOrdersService,
  ) {}

  @Process('check_withdrawal_confirmations')
  async handleCheckConfirmations(job: Job) {
    this.logger.log('Checking withdrawal confirmations...');

    try {
      // Get all withdrawals that need confirmation
      const pendingWithdrawals =
        await this.withdrawalService.getPendingWithdrawals();

      if (pendingWithdrawals.length === 0) {
        this.logger.debug('No pending withdrawals to check');
        return;
      }

      this.logger.log(
        `Found ${pendingWithdrawals.length} withdrawals to check`,
      );

      // Check each withdrawal
      for (const withdrawal of pendingWithdrawals) {
        try {
          await this.checkWithdrawalStatus(withdrawal.id);
        } catch (error) {
          this.logger.error(
            `Error checking withdrawal ${withdrawal.id}: ${error.message}`,
          );
          // Continue with other withdrawals
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in confirmation worker: ${error.message}`,
        error.stack,
      );
    } finally {
      // Schedule next check (every 30 seconds)
      await (job.queue as any).add(
        'check_withdrawal_confirmations',
        {},
        {
          delay: 30000,
          removeOnComplete: true,
        },
      );
    }
  }

  /**
   * Monitor market making withdrawal confirmations
   * This handler checks both base and quote withdrawal confirmations
   * and proceeds to join_campaign once both are confirmed
   */
  @Process('monitor_mm_withdrawal')
  async handleMonitorMMWithdrawal(job: Job<MonitorMMWithdrawalData>) {
    const { orderId, baseWithdrawalTxId, quoteWithdrawalTxId } = job.data;
    const startTime = Date.now();
    const retryCount = job.attemptsMade || 0;

    this.logger.log(
      `Monitoring MM withdrawals for order ${orderId} (attempt ${retryCount + 1})`,
    );

    try {
      // Check base withdrawal confirmation
      const baseConfirmed = baseWithdrawalTxId
        ? await this.checkWithdrawalConfirmation(baseWithdrawalTxId)
        : false;

      // Check quote withdrawal confirmation
      const quoteConfirmed = quoteWithdrawalTxId
        ? await this.checkWithdrawalConfirmation(quoteWithdrawalTxId)
        : false;

      this.logger.log(
        `Order ${orderId} withdrawal status - Base: ${baseConfirmed ? 'confirmed' : 'pending'}, Quote: ${quoteConfirmed ? 'confirmed' : 'pending'}`,
      );

      // Check for timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > this.WITHDRAWAL_TIMEOUT_MS) {
        this.logger.error(
          `Withdrawal confirmation timeout for order ${orderId} after ${elapsed}ms`,
        );
        // Mark order as failed due to timeout
        await this.userOrdersService.updateMarketMakingOrderState(
          orderId,
          'failed',
        );
        return;
      }

      // If both confirmed, proceed to join campaign
      if (baseConfirmed && quoteConfirmed) {
        this.logger.log(
          `Both withdrawals confirmed for order ${orderId}, proceeding to join campaign`,
        );
        await this.marketMakingQueue.add(
          'join_campaign',
          { orderId },
          {
            jobId: `join_campaign_${orderId}`,
            removeOnComplete: false,
          },
        );
        this.logger.log(`Queued join_campaign for order ${orderId}`);
        return;
      }

      // Not confirmed yet, retry after delay
      this.logger.log(
        `Withdrawals not fully confirmed for order ${orderId}, retrying in ${this.RETRY_DELAY_MS}ms`,
      );
      await job.queue.add('monitor_mm_withdrawal', job.data, {
        jobId: `monitor_withdrawal_${orderId}`,
        delay: this.RETRY_DELAY_MS,
        attempts: retryCount + 1,
      });
    } catch (error) {
      this.logger.error(
        `Error monitoring MM withdrawal for order ${orderId}: ${error.message}`,
        error.stack,
      );

      // Retry if not exceeded max attempts
      const maxAttempts = 60; // 60 retries * 30s = 30 minutes max
      if (retryCount < maxAttempts) {
        this.logger.log(
          `Retrying withdrawal monitoring for order ${orderId} (${retryCount + 1}/${maxAttempts})`,
        );
        await job.queue.add('monitor_mm_withdrawal', job.data, {
          jobId: `monitor_withdrawal_${orderId}`,
          delay: this.RETRY_DELAY_MS,
          attempts: retryCount + 1,
        });
      } else {
        this.logger.error(
          `Max retries exceeded for order ${orderId}, marking as failed`,
        );
        await this.userOrdersService.updateMarketMakingOrderState(
          orderId,
          'failed',
        );
      }
    }
  }

  /**
   * Check if a withdrawal is confirmed by checking the Mixin snapshot
   */
  private async checkWithdrawalConfirmation(
    txId: string,
  ): Promise<boolean> {
    try {
      const snapshot =
        await this.mixinClientService.client.safe.fetchSafeSnapshot(txId);

      if (!snapshot) {
        this.logger.warn(`Snapshot ${txId} not found`);
        return false;
      }

      // Consider confirmed if we have at least 1 confirmation and a transaction hash
      const confirmed =
        snapshot.confirmations >= 1 && !!snapshot.transaction_hash;

      if (confirmed) {
        this.logger.log(
          `Withdrawal ${txId} confirmed (confirmations: ${snapshot.confirmations}, hash: ${snapshot.transaction_hash})`,
        );
      }

      return confirmed;
    } catch (error) {
      this.logger.error(
        `Error checking withdrawal ${txId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Check individual withdrawal status from Mixin API
   */
  private async checkWithdrawalStatus(withdrawalId: string): Promise<void> {
    const withdrawal = await this.withdrawalService.getWithdrawalById(
      withdrawalId,
    );

    if (!withdrawal) {
      this.logger.error(`Withdrawal ${withdrawalId} not found`);
      return;
    }

    if (!withdrawal.mixinTxId) {
      this.logger.warn(
        `Withdrawal ${withdrawalId} has no mixinTxId, cannot check status`,
      );
      return;
    }

    try {
      // Update last checked timestamp
      await this.withdrawalService.updateLastChecked(withdrawalId);

      // Check transaction status from Mixin
      const txStatus = await this.checkMixinTransactionStatus(
        withdrawal.mixinTxId,
      );

      if (!txStatus) {
        this.logger.warn(
          `Could not fetch status for withdrawal ${withdrawalId}, txId: ${withdrawal.mixinTxId}`,
        );
        return;
      }

      // Update withdrawal status based on transaction status
      if (txStatus.status === 'completed' || txStatus.confirmed) {
        await this.withdrawalService.updateWithdrawalStatus(
          withdrawalId,
          'completed',
          {
            onChainTxId: txStatus.onChainHash,
          },
        );
        this.logger.log(
          `Withdrawal ${withdrawalId} confirmed and completed, onChainTx: ${txStatus.onChainHash}`,
        );
      } else if (txStatus.status === 'pending') {
        // Update to confirmed status if still pending on chain
        if (withdrawal.status === 'sent') {
          await this.withdrawalService.updateWithdrawalStatus(
            withdrawalId,
            'confirmed',
            {
              onChainTxId: txStatus.onChainHash,
            },
          );
          this.logger.log(
            `Withdrawal ${withdrawalId} confirmed, waiting for blockchain confirmations`,
          );
        }
      } else if (txStatus.status === 'failed') {
        await this.withdrawalService.markAsFailed(
          withdrawalId,
          'Transaction failed on blockchain',
        );
        this.logger.error(`Withdrawal ${withdrawalId} failed on blockchain`);
      }
    } catch (error) {
      this.logger.error(
        `Error checking withdrawal status ${withdrawalId}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Check transaction status from Mixin API
   * This is a placeholder - implement actual Mixin API call
   */
  private async checkMixinTransactionStatus(txId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    confirmed: boolean;
    onChainHash?: string;
  } | null> {
    try {
      const snapshot =
        await this.mixinClientService.client.safe.fetchSafeSnapshot(txId);

      if (!snapshot) {
        this.logger.warn(`Transaction ${txId} not found in snapshots`);
        return null;
      }

      // Check if transaction has been confirmed
      const confirmed = snapshot.confirmations >= 1;
      const status = confirmed ? 'completed' : 'pending';

      return {
        status,
        confirmed,
        onChainHash: snapshot.transaction_hash,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch transaction ${txId} from Mixin: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Optional: Check transaction status from blockchain explorer
   * This can be implemented for additional verification
   */
  private async checkBlockchainExplorer(
    assetId: string,
    txHash: string,
  ): Promise<boolean> {
    return false;
  }

  /**
   * Optional: Check if deposit arrived at destination exchange
   * This can be implemented if withdrawing to an exchange
   */
  private async checkExchangeDeposit(
    exchangeName: string,
    assetSymbol: string,
    amount: string,
  ): Promise<boolean> {
    return false;
  }
}
