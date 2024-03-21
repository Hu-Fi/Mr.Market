import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import {
  isExchangeIndexValid,
  isSpotOrderTypeValid,
  isTradingTypeValid,
} from 'src/common/helpers/checks/spotChecks';
import {
  getAssetIDBySymbol,
  getPairSymbolByKey,
  getRFC3339Timestamp,
} from 'src/common/helpers/utils';
import { PairsMapKey } from 'src/common/types/pairs/pairs';
import {
  ExchangePlaceSpotEvent,
  MixinReleaseTokenEvent,
  SpotOrderCreateEvent,
} from 'src/modules/mixin/events/spot.event';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';

@Injectable()
export class SpotOrderListener {
  constructor(
    private exchangeService: ExchangeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('spot.create')
  async handleSpotOrderCreateEvent(event: SpotOrderCreateEvent) {
    // Check event parameters
    if (!isTradingTypeValid(event.tradingType)) {
      return;
    }
    if (!isSpotOrderTypeValid(event.spotOrderType)) {
      return;
    }
    if (!isExchangeIndexValid(event.exchangeIndex)) {
      return;
    }

    // Get Asset ID of buy and sell asset
    const symbol = getPairSymbolByKey(event.destId as PairsMapKey);
    if (symbol === '') {
      // unsupported symbol
      return;
    }
    // BTC/USDT-ERC20, baseAssetID = BTC_UUID, targetAssetID = USDT_ERC20_UUID
    const { baseAssetID, targetAssetID } = getAssetIDBySymbol(symbol);

    // Determine direction by spot order type
    let buy: boolean;
    if (event.spotOrderType.endsWith('B')) {
      buy = true;
    } else if (event.spotOrderType.endsWith('S')) {
      buy = false;
    } else {
      return;
    }

    // Check payment asset correctness
    if (buy && targetAssetID != event.snapshot.asset_id) {
      // Buy BTC/USDT, pay USDT, check payment asset is USDT
      return;
    }

    if (!buy && baseAssetID != event.snapshot.asset_id) {
      // Sell BTC/USDT, pay BTC, check payment asset is BTC
      return;
    }

    // Generate and write order to db
    const timeNow = getRFC3339Timestamp();
    const orderId = randomUUID();
    const order: ExchangePlaceSpotEvent = {
      orderId,
      exchangeIndex: event.exchangeIndex,
      snapshotId: event.snapshot.snapshot_id,
      type: event.spotOrderType,
      state: STATE_TEXT_MAP['CREATED'],
      symbol: symbol,
      baseAssetId: baseAssetID,
      targetAssetId: targetAssetID,
      amount: event.snapshot.amount,
      createdAt: timeNow,
      updatedAt: timeNow,
      limitPrice: event.limitPrice,
      refId: event.refId,
    };

    const mixinEvent: MixinReleaseTokenEvent = {
      orderId,
      userId: event.snapshot.opponent_id,
      assetId: buy ? baseAssetID : targetAssetID,
      amount: '',
      createdAt: timeNow,
      updatedAt: timeNow,
    };
    await this.exchangeService.createSpotOrder(order);

    // Jump to step 2: place order in exchange (exchange.listener.ts)
    this.eventEmitter.emit('exchange.spot.place', { order, mixinEvent });
  }
}
