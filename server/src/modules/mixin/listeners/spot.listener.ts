/**
 * SpotOrderListener
 *
 * This listener service handles events related to spot orders. It processes the 'spot.create' event,
 * validates the event data, and manages the creation of spot orders, including placing the order
 * on an exchange and handling subsequent events.
 *
 * Dependencies:
 * - ExchangeService: Service for interacting with exchange-related data and operations.
 * - EventEmitter2: Event emitter for managing custom events.
 * - Helper functions: Utilities for validating data and managing asset IDs and symbols.
 *
 * Events:
 * - 'spot.create': Event triggered when a spot order is created.
 * - 'exchange.spot.place': Event triggered to place the order on an exchange.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected ExchangeService and EventEmitter2.
 *
 * - handleSpotOrderCreateEvent(event: SpotOrderCreateEvent): Handles the 'spot.create' event.
 *   Validates event parameters, determines order direction, checks asset correctness, generates
 *   order data, and emits the 'exchange.spot.place' event.
 *
 * Notes:
 * - Spot order execution process (Here is the step 2)
 *  1. Loop snapshots on mixin, find incoming transfer
 *  2. Send create spot order event to spot.listener.ts
 *  3. If basic checks are passed, send place order event, write to db in exchange.listener.ts
 *  4. Wait for state update scheduler to update order state, in exchange.service.ts
 *  5. If the state updated to succeess, send release token event to mixin.listener.ts
 *
 * - The service ensures that the event data is valid and the assets are correctly matched.
 * - Orders are created and stored in the database before being placed on an exchange.
 * - The mixinEvent object is used to manage token releases related to the order.
 */

import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import {
  isSpotOrderTypeValueValid,
  isTradingTypeValueValid,
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
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class SpotOrderListener {
  private readonly logger = new CustomLogger(SpotOrderListener.name);

  constructor(
    private exchangeService: ExchangeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('spot.create')
  async handleSpotOrderCreateEvent(event: SpotOrderCreateEvent) {
    // Check event parameters
    if (!isTradingTypeValueValid(event.tradingType)) {
      return;
    }
    if (!isSpotOrderTypeValueValid(event.spotOrderType)) {
      return;
    }
    if (!isExchangeIndexValueValid(event.exchangeName)) {
      return;
    }
    this.logger.debug(`spot.create:${JSON.stringify(event)}`);

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
    if (event.spotOrderType.toUpperCase().includes('BUY')) {
      buy = true;
    } else if (event.spotOrderType.toUpperCase().endsWith('SELL')) {
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
      exchangeName: event.exchangeName,
      snapshotId: event.snapshot.snapshot_id,
      userId: event.snapshot.opponent_id,
      type: event.spotOrderType,
      state: STATE_TEXT_MAP['CREATED'],
      symbol: symbol,
      amount: event.snapshot.amount,
      baseAssetId: baseAssetID,
      targetAssetId: targetAssetID,
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
