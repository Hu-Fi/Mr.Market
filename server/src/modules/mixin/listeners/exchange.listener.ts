import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getExchangeNameByIndex } from 'src/common/helpers/utils';
import {
  ExchangePlaceSpotEvent,
  MixinReleaseTokenEvent,
} from 'src/modules/mixin/events/spot.event';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';

@Injectable()
export class ExchangeListener {
  constructor(
    private exchangeService: ExchangeService,
    private snapshotService: SnapshotsService,
  ) {}

  @OnEvent('exchange.spot.place')
  async handlePlaceSpotOrderEvent(payload: {
    event: ExchangePlaceSpotEvent;
    mixinEvent: MixinReleaseTokenEvent;
  }) {
    const { event, mixinEvent } = payload;
    const exchangeName = getExchangeNameByIndex(event.exchangeIndex);

    let baseSymbol = event.symbol.split('/')[0];
    let targetSymbol = event.symbol.split('/')[1];
    if (baseSymbol.includes('USDT')) {
      baseSymbol = 'USDT';
    }
    if (targetSymbol.includes('USDT')) {
      targetSymbol = 'USDT';
    }
    const orderTypeBuy = event.type.endsWith('B');
    const assetSymbol = orderTypeBuy ? targetSymbol : baseSymbol;

    const key = await this.exchangeService.pickAPIKeyOnDemand(
      exchangeName,
      assetSymbol,
      event.amount,
    );
    if (key.type === 'error') {
      await this.exchangeService.updateSpotOrderState(
        event.orderId,
        STATE_TEXT_MAP['EXCHANGE_BALANCE_NOT_ENOUGH'],
      );
      return;
    }
    const orderTypeLimit = event.type.endsWith('L');
    const checkAssetId = orderTypeBuy ? event.baseAssetId : event.targetAssetId;
    const estimateReceiveAmount = await this.exchangeService.estimateSpotAmount(
      exchangeName,
      event.symbol,
      orderTypeBuy,
      event.amount,
      orderTypeLimit ? event.limitPrice : undefined,
    );
    if (
      !(await this.snapshotService.checkMixinBalanceEnough(
        checkAssetId,
        estimateReceiveAmount,
      ))
    ) {
      await this.exchangeService.updateSpotOrderState(
        event.orderId,
        STATE_TEXT_MAP['MIXIN_BALANCE_NOT_ENOUGH'],
      );
      return;
    }

    // Place order
    await this.exchangeService.placeOrder(
      event.orderId,
      exchangeName,
      orderTypeLimit,
      orderTypeBuy,
      key.id,
      key.api_key,
      key.secret,
      `${baseSymbol}/${targetSymbol}`,
      event.amount,
    );

    await this.exchangeService.addMixinReleaseToken({
      orderId: mixinEvent.orderId,
      userId: mixinEvent.userId,
      assetId: mixinEvent.assetId,
      state: STATE_TEXT_MAP['MIXIN_RELEASE_INIT'],
      amount: mixinEvent.amount,
      createdAt: mixinEvent.createdAt,
      updatedAt: mixinEvent.updatedAt,
    });
    // Jump to step 3, update order state (exchange.service.ts)
  }
}
