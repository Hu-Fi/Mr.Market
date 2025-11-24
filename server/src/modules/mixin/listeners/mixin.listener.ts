/**
 * MixinListener
 *
 * This listener service handles events related to the release of tokens on the Mixin network.
 * It processes the 'mixin.release' event, validates event data, updates order states, and manages
 * the transaction of tokens, including recording release history.
 *
 * Dependencies:
 * - SnapshotsService: Service for interacting with Mixin snapshots.
 * - ExchangeService: Service for interacting with exchange-related data and operations.
 * - CustomConfigService: Service for reading and modifying custom configuration settings.
 * - Helper functions: Utilities for validating data, managing timestamps, and calculating fees.
 * - STATE_TEXT_MAP: Mapping of state text for various order states.
 *
 * Events:
 * - 'mixin.release': Event triggered to release tokens on the Mixin network.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected SnapshotsService, ExchangeService, and CustomConfigService.
 *
 * - handleReleaseTokenEvent(e: MixinReleaseTokenEvent): Handles the 'mixin.release' event.
 *   Validates asset and user IDs, checks release history, subtracts fees, sends the transaction,
 *   updates order state, and records release history.
 *
 * Notes:
 * - Spot order execution process (Here is the step 5)
 *  1. Loop snapshots on mixin, find incoming transfer
 *  2. Send create spot order event to spot.listener.ts
 *  3. If basic checks are passed, send place order event, write to db in exchange.listener.ts
 *  4. Wait for state update scheduler to update order state, in exchange.service.ts
 *  5. If the state updated to succeess, send release token event to mixin.listener.ts
 *
 * - The service ensures that the event data is valid and the transaction is processed securely.
 * - Error handling is implemented to log and manage errors during the release process.
 * - The service updates the order state and records release history to maintain accurate tracking of transactions.
 */

import { validate } from 'uuid';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getRFC3339Timestamp, subtractFee } from 'src/common/helpers/utils';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { CustomConfigService } from 'src/modules/infrastructure/custom-config/custom-config.service';
import { MarketMakingDepositEvent } from 'src/modules/market-making/events/market-making.event';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { WithdrawalService } from 'src/modules/market-making/withdrawal/withdrawal.service';

@Injectable()
export class MixinListener {
  private readonly logger = new CustomLogger(MixinListener.name);

  constructor(
    private service: SnapshotsService,
    private exchangeService: ExchangeService,
    private configService: CustomConfigService,
    private withdrawalService: WithdrawalService,
  ) { }

  @OnEvent('mixin.release')
  async handleReleaseTokenEvent(e: MixinReleaseTokenEvent) {
    // Validate assetId and userId
    if (!validate(e.assetId) || !validate(e.userId)) {
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }

    // Ensure orderId does not exist in release history to proceed
    if (await this.exchangeService.readMixinReleaseHistory(e.orderId)) {
      // If it exists, it's either an error or a retry of a previously processed request. Handle accordingly.
      return;
    }

    // Subtract the trading fees
    const feePercentage = await this.configService.readSpotFee();
    const { amount: amountReduced, fee } = subtractFee(e.amount, feePercentage);

    // Attempt to send the transaction
    const requests = await this.service.sendMixinTx(
      e.userId,
      e.assetId,
      amountReduced,
    );

    // Check if the transaction was unsuccessful
    if (!requests || requests.length === 0) {
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }

    // Update the order state to released
    await this.exchangeService.updateSpotOrderState(
      e.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASED'],
    );

    await this.exchangeService.addMixinReleaseHistory({
      orderId: e.orderId,
      snapshotId: requests[0].snapshot_id,
      createdAt: getRFC3339Timestamp(),
      fee,
    });
  }

  @OnEvent('market_making.deposit')
  async handleMarketMakingDeposit(e: MarketMakingDepositEvent) {
    this.logger.log(`Received deposit from user ${e.userId} for asset ${e.assetId}`);

    await this.withdrawalService.createWithdrawal({
      userId: e.userId,
      amount: Number(e.amount),
      assetId: e.assetId,
      symbol: e.symbol,
      mixinTxId: e.mixinTxId,
      type: 'deposit_to_exchange',
      status: 'pending',
    });
  }
}
