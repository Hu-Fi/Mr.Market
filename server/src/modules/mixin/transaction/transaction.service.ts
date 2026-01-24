import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import {
  SafeSnapshot,
  buildSafeTransactionRecipient,
  getTotalBalanceFromOutputs,
  getUnspentOutputsForRecipients,
  buildSafeTransaction,
  encodeSafeTransaction,
  signSafeTransaction,
  SequencerTransactionRequest,
  getUuid,
} from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { MixinClientService } from '../client/mixin-client.service';

@Injectable()
export class TransactionService {
  private readonly logger = new CustomLogger(TransactionService.name);

  constructor(private mixinClientService: MixinClientService) { }

  /**
   * Send a Mixin transaction to a specific opponent
   */
  async transfer(
    opponent_id: string,
    asset_id: string,
    amount: string,
    memo: string,
  ): Promise<SequencerTransactionRequest[]> {
    const recipients = [
      buildSafeTransactionRecipient([opponent_id], 1, amount),
    ];
    const outputs = await this.mixinClientService.client.utxo.safeOutputs({
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
    const requestId = getUuid();
    const ghosts = await this.mixinClientService.client.utxo.ghostKey(
      recipients,
      requestId,
      this.mixinClientService.spendKey,
    );
    const tx = buildSafeTransaction(
      utxos,
      recipients,
      ghosts,
      Buffer.from(memo),
    );
    const raw = encodeSafeTransaction(tx);

    const verifiedTx =
      await this.mixinClientService.client.utxo.verifyTransaction([
        {
          raw,
          request_id: requestId,
        },
      ]);

    const signedRaw = signSafeTransaction(
      tx,
      verifiedTx[0].views,
      this.mixinClientService.spendKey,
    );

    const sendedTx =
      await this.mixinClientService.client.utxo.sendTransactions([
        {
          raw: signedRaw,
          request_id: requestId,
        },
      ]);
    return sendedTx;
  }

  /**
   * Refund a snapshot back to the sender
   */
  async refund(snapshot: SafeSnapshot) {
    this.logger.log(
      `[Service] Attempting refund for snapshot ${snapshot.snapshot_id}: ${snapshot.amount} of asset ${snapshot.asset_id} to ${snapshot.opponent_id}`,
    );
    try {
      const result = await this.transfer(
        snapshot.opponent_id,
        snapshot.asset_id,
        snapshot.amount,
        `Refund:${snapshot.snapshot_id}`
      );
      this.logger.log(
        `[Service] Refund successful for snapshot ${snapshot.snapshot_id}: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to refund snapshot ${snapshot.snapshot_id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
