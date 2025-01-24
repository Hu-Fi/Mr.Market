/**
 * ExchangeListener
 *
 * This listener service handles events related to placing spot orders on an exchange.
 * It processes the 'exchange.spot.place' event, validates event data, checks balances,
 * and manages the placement of spot orders.
 *
 * Dependencies:
 * - ExchangeService: Service for interacting with exchange-related data and operations.
 * - SnapshotsService: Service for interacting with Mixin snapshots.
 * - STATE_TEXT_MAP: Mapping of state text for various order states.
 * - Events: ExchangePlaceSpotEvent and MixinReleaseTokenEvent for handling spot order and token release events.
 *
 * Events:
 * - 'exchange.spot.place': Event triggered to place spot orders on an exchange.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected ExchangeService and SnapshotsService.
 *
 * - handlePlaceSpotOrderEvent(payload: { event: ExchangePlaceSpotEvent; mixinEvent: MixinReleaseTokenEvent }): Handles the 'exchange.spot.place' event.
 *   Validates event data, checks if the balance is sufficient, places the order, and adds a Mixin release token.
 *
 * Notes:
 * - Spot order execution process (Here is the step 3 and 4)
 *  1. Loop snapshots on mixin, find incoming transfer
 *  2. Send create spot order event to spot.listener.ts
 *  3. If basic checks are passed, send place order event, write to db in exchange.listener.ts
 *  4. Wait for state update scheduler to update order state, in exchange.service.ts
 *  5. If the state updated to succeess, send release token event to mixin.listener.ts
 *
 * - The service ensures that the event data is valid and the spot order is processed securely.
 * - Error handling is implemented to manage errors during the spot order process.
 * - The service updates the order state and manages token releases based on the received event data.
 */

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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
    console.log('payload', payload);
    // const { event, mixinEvent } = payload;
    // const exchangeName = event.exchangeName;
    // let [baseSymbol, targetSymbol] = event.symbol.split('/');
    // if (baseSymbol.includes('USDT')) {
    //   baseSymbol = 'USDT';
    // }
    // if (targetSymbol.includes('USDT')) {
    //   targetSymbol = 'USDT';
    // }
    // const orderTypeBuy = event.type.endsWith('B');
    // const assetSymbol = orderTypeBuy ? targetSymbol : baseSymbol;
    // const key = await this.exchangeService.pickAPIKeyOnDemand(
    //   exchangeName,
    //   assetSymbol,
    //   event.amount,
    // );
    // if (key.type === 'error') {
    //   await this.exchangeService.updateSpotOrderState(
    //     event.orderId,
    //     STATE_TEXT_MAP['EXCHANGE_BALANCE_NOT_ENOUGH'],
    //   );
    //   return;
    // }
    // const orderTypeLimit = event.type.endsWith('L');
    // const checkAssetId = orderTypeBuy ? event.baseAssetId : event.targetAssetId;
    // const estimateReceiveAmount = await this.exchangeService.estimateSpotAmount(
    //   exchangeName,
    //   event.symbol,
    //   orderTypeBuy,
    //   event.amount,
    //   orderTypeLimit ? event.limitPrice : undefined,
    // );
    // if (
    //   !(await this.snapshotService.checkMixinBalanceEnough(
    //     checkAssetId,
    //     estimateReceiveAmount,
    //   ))
    // ) {
    //   await this.exchangeService.updateSpotOrderState(
    //     event.orderId,
    //     STATE_TEXT_MAP['MIXIN_BALANCE_NOT_ENOUGH'],
    //   );
    //   return;
    // }
    // // Place order
    // await this.exchangeService.placeOrder(
    //   event.orderId,
    //   exchangeName,
    //   orderTypeLimit,
    //   orderTypeBuy,
    //   key.id,
    //   key.api_key,
    //   key.secret,
    //   `${baseSymbol}/${targetSymbol}`,
    //   event.amount,
    // );
    // await this.exchangeService.addMixinReleaseToken({
    //   orderId: mixinEvent.orderId,
    //   userId: mixinEvent.userId,
    //   assetId: mixinEvent.assetId,
    //   state: STATE_TEXT_MAP['MIXIN_RELEASE_INIT'],
    //   amount: mixinEvent.amount,
    //   createdAt: mixinEvent.createdAt,
    //   updatedAt: mixinEvent.updatedAt,
    // });
    // // Jump to step 3, update order state (exchange.service.ts)
  }
}
