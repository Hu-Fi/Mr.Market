import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getExchangeNameByIndex } from 'src/common/helpers/utils';
import { ExchangePlaceSpotEvent } from 'src/modules/mixin/events/spot.event';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';

@Injectable()
export class ExchangeListener {
  constructor(
    private exchangeService: ExchangeService,
    private snapshotService: SnapshotsService,
  ) {}

  @OnEvent('exchange.spot.place')
  async handlePlaceSpotOrderEvent(event: ExchangePlaceSpotEvent) {
    const exchangeName = getExchangeNameByIndex(event.exchangeIndex);

    let baseSymbol = event.symbol.split('/')[0];
    let targetSymbol = event.symbol.split('/')[1];
    if (baseSymbol.includes('USDT')) {
      // USDT-ERC20 to USDT
      baseSymbol = 'USDT';
    }
    if (targetSymbol.includes('USDT')) {
      // USDT-ERC20 to USDT
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
      await this.exchangeService.updateSpotOrderState(event.orderId, '90011');
      return;
    }

    const checkAssetId = orderTypeBuy ? event.baseAssetId : event.targetAssetId;
    const estimateReceiveAmount = '!!! TODO !!! FETCH FROM EXCHANGE !!! ';
    if (
      !(await this.snapshotService.checkMixinBalanceEnough(
        checkAssetId,
        estimateReceiveAmount,
      ))
    ) {
      await this.exchangeService.updateSpotOrderState(event.orderId, '90012');
      return;
    }

    const orderTypeLimit = event.type.endsWith('L');
    // Place order
    this.exchangeService.placeOrder(
      event.orderId,
      exchangeName,
      orderTypeLimit,
      orderTypeBuy,
      key.id,
      key.secret,
      `${baseSymbol}/${targetSymbol}`,
      event.amount,
    );
  }
}
