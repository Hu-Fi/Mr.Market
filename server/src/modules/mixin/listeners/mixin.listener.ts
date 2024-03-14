import { validate } from 'uuid';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getRFC3339Timestamp, subtractFee } from 'src/common/helpers/utils';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';

@Injectable()
export class MixinListener {
  constructor(
    private service: SnapshotsService,
    private exchangeService: ExchangeService,
    private configService: CustomConfigService,
  ) {}

  @OnEvent('mixin.release')
  async handleReleaseTokenEvent(e: MixinReleaseTokenEvent) {
    if (!validate(e.assetId)) {
      // Asset Id must be uuid;
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }
    if (!validate(e.userId)) {
      // User Id must be uuid;
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }

    // Check if orderId exist in release history
    if (!this.exchangeService.readMixinReleaseHistory(e.orderId)) {
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }

    // Sub the trading fees
    const feePercentage = await this.configService.readSpotFee();
    const { amount: amountReduced, fee } = subtractFee(e.amount, feePercentage);

    // If released, return
    if (await this.exchangeService.readMixinReleaseHistory(e.orderId)) {
      return;
    }

    const requests = await this.service.sendMixinTx(
      e.userId,
      e.assetId,
      amountReduced,
    );

    if (requests.length === 0) {
      await this.exchangeService.updateSpotOrderState(
        e.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
      );
      return;
    }

    await this.exchangeService.updateSpotOrderState(
      e.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASED'],
    );

    await this.exchangeService.addMixinReleaseHistory({
      orderId: e.orderId,
      transaction: requests[0],
      createdAt: getRFC3339Timestamp(),
      fee,
    });
  }
}
