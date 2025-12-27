import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { WithdrawalService } from './withdrawal.service';
import { MixinClientService } from '../client/mixin-client.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Processor('withdrawal-confirmations')
export class WithdrawalConfirmationWorker {
  private readonly logger = new CustomLogger(WithdrawalConfirmationWorker.name);

  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly mixinClientService: MixinClientService,
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
