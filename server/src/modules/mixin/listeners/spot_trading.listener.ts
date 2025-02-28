// Update src/modules/mixin/listeners/spot.listener.ts
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { BigNumber } from 'bignumber.js';
import {
  isSpotOrderTypeValueValid,
  isTradingTypeValueValid,
} from 'src/common/helpers/checks/spotChecks';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';
import {
  ExchangePlaceSpotEvent,
  MixinReleaseTokenEvent,
  SpotOrderCreateEvent,
} from 'src/modules/mixin/events/spot.event';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';

@Injectable()
export class SpotOrderListener {
  private readonly logger = new CustomLogger(SpotOrderListener.name);

  constructor(
    private exchangeService: ExchangeService,
    private eventEmitter: EventEmitter2,
    private snapshotsService: SnapshotsService,
    private spotdataService: SpotdataService,
  ) {}

  @OnEvent('spot_trading.create_limit_order')
  @OnEvent('spot_trading.create_market_order')
  async handleSpotOrderCreateEvent(event: SpotOrderCreateEvent) {
    // try {
    //   // Validate basic parameters
    //   if (!this.validateEventParameters(event)) {
    //     await this.handleInvalidOrder(event, 'Invalid order parameters');
    //     return;
    //   }
    //   // Get symbol details from database
    //   const symbolDetails = await this.spotdataService.getTradingPairById(
    //     event.tradingPairId,
    //   );
    //   if (!symbolDetails) {
    //     await this.handleInvalidOrder(event, 'Invalid trading pair');
    //     return;
    //   }
    //   // Validate payment asset
    //   if (!this.validatePaymentAsset(event, symbolDetails)) {
    //     await this.handleInvalidOrder(event, 'Invalid payment asset');
    //     return;
    //   }
    //   // Check exchange balance
    //   const isBalanceSufficient = await this.checkUserBalance(
    //     event,
    //     symbolDetails,
    //   );
    //   if (!isBalanceSufficient) {
    //     await this.handleInsufficientBalance(event);
    //     return;
    //   }
    //   // Create and persist order
    //   const { order, mixinEvent } = await this.createOrderObject(
    //     event,
    //     symbolDetails,
    //   );
    //   await this.exchangeService.createSpotOrder(order);
    //   // Proceed to order placement
    //   this.eventEmitter.emit('exchange.spot.place', { order, mixinEvent });
    // } catch (error) {
    //   this.logger.error(`Order processing failed: ${error.message}`);
    //   await this.handleOrderFailure(event, error.message);
    // }
  }

  // private async validateEventParameters(
  //   event: SpotOrderCreateEvent,
  // ): Promise<boolean> {
  //   if (!isTradingTypeValueValid(event.tradingType)) return false;
  //   if (!isSpotOrderTypeValueValid(event.spotOrderType)) return false;
  //   if (!event.symbol || !event.amount) return false;
  //   if (event.spotOrderType === 'LIMIT' && !event.limitPrice) return false;
  //   return true;
  // }

  // private async validatePaymentAsset(
  //   event: SpotOrderCreateEvent,
  //   symbolDetails: any,
  // ): Promise<boolean> {
  //   const isBuyOrder = event.spotOrderType.toUpperCase().includes('BUY');
  //   const expectedAssetId = isBuyOrder
  //     ? symbolDetails.targetAssetId
  //     : symbolDetails.baseAssetId;
  //   return event.snapshot.asset_id === expectedAssetId;
  // }

  // private async checkUserBalance(
  //   event: SpotOrderCreateEvent,
  //   symbolDetails: any,
  // ): Promise<boolean> {
  //   const requiredAssetId = event.spotOrderType.includes('BUY')
  //     ? symbolDetails.targetAssetId
  //     : symbolDetails.baseAssetId;

  //   const balance = await this.snapshotsService.getAssetBalance(
  //     requiredAssetId,
  //   );
  //   return new BigNumber(balance).isGreaterThanOrEqualTo(event.amount);
  // }

  // private async createOrderObject(
  //   event: SpotOrderCreateEvent,
  //   symbolDetails: any,
  // ) {
  //   const timeNow = getRFC3339Timestamp();
  //   const orderId = randomUUID();
  //   const isBuyOrder = event.spotOrderType.toUpperCase().includes('BUY');

  //   const order: ExchangePlaceSpotEvent = {
  //     orderId,
  //     exchangeName: event.exchangeName,
  //     snapshotId: event.snapshot.snapshot_id,
  //     userId: event.snapshot.opponent_id,
  //     type: event.spotOrderType,
  //     state: STATE_TEXT_MAP['CREATED'],
  //     symbol: event.symbol,
  //     amount: event.snapshot.amount,
  //     baseAssetId: symbolDetails.baseAssetId,
  //     targetAssetId: symbolDetails.targetAssetId,
  //     createdAt: timeNow,
  //     updatedAt: timeNow,
  //     limitPrice: event.limitPrice,
  //   };

  //   const mixinEvent: MixinReleaseTokenEvent = {
  //     orderId,
  //     userId: event.snapshot.opponent_id,
  //     assetId: isBuyOrder
  //       ? symbolDetails.baseAssetId
  //       : symbolDetails.targetAssetId,
  //     amount: event.snapshot.amount,
  //     createdAt: timeNow,
  //     updatedAt: timeNow,
  //   };

  //   return { order, mixinEvent };
  // }

  // private async handleInvalidOrder(
  //   event: SpotOrderCreateEvent,
  //   reason: string,
  // ) {
  //   this.logger.warn(`Invalid order: ${reason}`);
  //   await this.snapshotsService.refund(event.snapshot);
  //   await this.exchangeService.createFailedOrder({
  //     ...event,
  //     status: OrderStatus.FAILED,
  //     errorMessage: reason,
  //   });
  // }

  // private async handleInsufficientBalance(event: SpotOrderCreateEvent) {
  //   const errorMsg = 'Insufficient balance for order execution';
  //   this.logger.warn(errorMsg);
  //   await this.snapshotsService.refund(event.snapshot);
  //   await this.exchangeService.createFailedOrder({
  //     ...event,
  //     status: OrderStatus.FAILED,
  //     errorMessage: errorMsg,
  //   });
  // }

  // private async handleOrderFailure(event: SpotOrderCreateEvent, error: string) {
  //   await this.snapshotsService.refund(event.snapshot);
  //   await this.exchangeService.createFailedOrder({
  //     ...event,
  //     status: OrderStatus.FAILED,
  //     errorMessage: error,
  //   });
  // }
}
