import { validate } from 'uuid';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';

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

    // Sub the trading fees, release if haven't release yet
    const fee = await this.configService.readSpotFee();
    // TODO: Write a sub fee utils function
    const amountReduced = fee;

    const requests = await this.service.sendMixinTx(
      e.userId,
      e.assetId,
      amountReduced,
    );

    this.exchangeService.addMixinReleaseHistory();
  }
}
