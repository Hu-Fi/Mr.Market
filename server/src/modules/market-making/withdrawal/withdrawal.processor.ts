import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WithdrawalService } from './withdrawal.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { ExchangeService } from '../../mixin/exchange/exchange.service';
import { SnapshotsService } from '../../mixin/snapshots/snapshots.service';

@Processor('withdrawals')
export class WithdrawalProcessor {
  private readonly logger = new CustomLogger(WithdrawalProcessor.name);

  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly exchangeService: ExchangeService,
    private readonly snapshotsService: SnapshotsService,
  ) { }

  @Process('process_withdrawal')
  async handleWithdrawal(job: Job<{ withdrawalId: string }>) {
    const { withdrawalId } = job.data;
    this.logger.log(`Processing withdrawal ${withdrawalId}`);

    const withdrawal = await this.withdrawalService.findById(withdrawalId);
    if (!withdrawal) {
      this.logger.error(`Withdrawal ${withdrawalId} not found`);
      return;
    }

    if (withdrawal.status !== 'pending') {
      this.logger.warn(`Withdrawal ${withdrawalId} is not pending, skipping`);
      return;
    }

    try {
      await this.withdrawalService.updateWithdrawal(withdrawal.id, { status: 'processing' });

      if (withdrawal.type === 'deposit_to_exchange') {
        // Logic to deposit to exchange (e.g. via CCXT or internal transfer if applicable)
        // For now, we assume this is handled by Mixin transfer to Exchange deposit address
        // But since we are the bot, we might need to send funds to the exchange's deposit address for this user
        // OR if this is just tracking incoming deposit, we might just mark it as completed if funds arrived

        // TODO: Implement actual transfer logic if needed. 
        // For 'deposit_to_exchange', it usually means User -> Bot (Mixin) -> Exchange Account
        // If the Bot holds the funds on Mixin, it needs to send to Exchange Deposit Address.

        // Mock success for now
        await this.withdrawalService.updateWithdrawal(withdrawal.id, {
          status: 'completed',
          exchangeTxId: 'mock_exchange_tx_id'
        });

      } else if (withdrawal.type === 'withdraw_external') {
        // Logic to withdraw from Exchange -> External
        // 1. Withdraw from Exchange to Bot (Mixin)
        // 2. Bot sends to User

        // TODO: Implement exchange withdrawal logic
        await this.withdrawalService.updateWithdrawal(withdrawal.id, {
          status: 'completed',
          onChainTxId: 'mock_onchain_tx_id'
        });
      }

      this.logger.log(`Withdrawal ${withdrawalId} completed`);
    } catch (error) {
      this.logger.error(`Failed to process withdrawal ${withdrawalId}: ${error.message}`);
      await this.withdrawalService.updateWithdrawal(withdrawal.id, { status: 'failed' });
      throw error; // Retry job
    }
  }
}
