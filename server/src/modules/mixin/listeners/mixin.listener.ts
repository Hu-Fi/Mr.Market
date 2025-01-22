import { validate } from 'uuid';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getRFC3339Timestamp, subtractFee } from 'src/common/helpers/utils';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { AdminSettingsService } from 'src/modules/admin/settings/adminSettings.service';

@Injectable()
export class MixinListener {
  constructor(
    private service: SnapshotsService,
    private exchangeService: ExchangeService,
    private configService: AdminSettingsService,
  ) {}

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
    const feePercentage = await this.configService.getSpotFee();
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

    // Record the release history
    await this.exchangeService.addMixinReleaseHistory({
      orderId: e.orderId,
      snapshotId: requests[0].snapshot_id,
      createdAt: getRFC3339Timestamp(),
      fee,
    });
  }
}
