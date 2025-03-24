import { randomUUID } from 'crypto';
import BigNumber from 'bignumber.js';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';
import {
  SpotLimitMemoDetails,
  SpotMarketMemoDetails,
} from 'src/common/types/memo/memo';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';

@Injectable()
export class SpotOrderListener implements OnModuleDestroy {
  private readonly logger = new CustomLogger(SpotOrderListener.name);
  private orderStatusCheckInterval: NodeJS.Timeout;
  private readonly CHECK_INTERVAL_MS = 30000; // 30 seconds

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly snapshotsService: SnapshotsService,
    private readonly spotdataService: SpotdataService,
  ) {
    // Initialize the order status update worker
    this.startOrderStatusUpdateWorker();
  }

  onModuleDestroy() {
    // Clean up interval on module destruction
    if (this.orderStatusCheckInterval) {
      clearInterval(this.orderStatusCheckInterval);
    }
  }

  private startOrderStatusUpdateWorker() {
    this.orderStatusCheckInterval = setInterval(
      () => this.checkPendingOrders(),
      this.CHECK_INTERVAL_MS,
    );
    this.logger.log('Order status update worker started');
  }

  private async checkPendingOrders() {
    try {
      // Fetch all pending orders (CREATED, PARTIALLY_FILLED)
      const pendingOrders = await this.exchangeService.getPendingSpotOrders();

      this.logger.debug(`Checking ${pendingOrders.length} pending orders`);

      // Process each order
      for (const order of pendingOrders) {
        try {
          if (order.type === 'limit') {
            await this.processLimitOrder(order);
          } else if (order.type === 'market') {
            await this.processMarketOrder(order);
          }
        } catch (error) {
          this.logger.error(
            `Error processing order ${order.orderId}: ${error.message}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in order status update worker: ${error.message}`,
        error.stack,
      );
    }
  }

  private async processLimitOrder(order) {
    // Get API key configuration
    const apiKeyConfig = await this.exchangeService.findFirstAPIKeyByExchange(
      order.exchangeName,
    );
    if (!apiKeyConfig) {
      this.logger.error(`API key not found for order: ${order.orderId}`);
      await this.exchangeService.updateSpotOrderState(
        order.orderId,
        STATE_TEXT_MAP['EXCHANGE_ORDER_CANCELED'],
      );
      return;
    }

    // Check order status on exchange
    const orderStatus = await this.exchangeService.checkOrderStatus(
      order.orderId,
      order.exchangeName,
      apiKeyConfig.api_key,
      apiKeyConfig.api_secret,
      order.symbol,
    );

    if (!orderStatus) {
      // Order not found or error occurred
      this.logger.warn(`Could not retrieve status for order: ${order.orderId}`);
      return;
    }

    // Update order status based on exchange response
    if (orderStatus.status === 'FILLED') {
      // Order is fully filled
      await this.handleFullyFilledOrder(order, orderStatus);
    } else if (orderStatus.status === 'PARTIALLY_FILLED') {
      // Order is partially filled
      await this.handlePartiallyFilledOrder(order, orderStatus);
    } else if (
      ['CANCELED', 'REJECTED', 'EXPIRED'].includes(orderStatus.status)
    ) {
      // Order failed or was canceled
      await this.handleFailedOrder(order, orderStatus);
    }
    // Other statuses (PENDING, NEW) don't require action
  }

  private async processMarketOrder(order) {
    // Market orders should be executed immediately, so we just need to check if they're done
    const apiKeyConfig = await this.exchangeService.findFirstAPIKeyByExchange(
      order.exchangeName,
    );
    if (!apiKeyConfig) {
      this.logger.error(`API key not found for order: ${order.orderId}`);
      await this.exchangeService.updateSpotOrderState(
        order.orderId,
        STATE_TEXT_MAP['FAILED'],
      );
      return;
    }

    // Check order status on exchange
    const orderStatus = await this.exchangeService.checkOrderStatus(
      order.orderId,
      order.exchangeName,
      apiKeyConfig.api_key,
      apiKeyConfig.api_secret,
      order.symbol,
    );

    if (!orderStatus) {
      // Order not found or error occurred
      this.logger.warn(
        `Could not retrieve status for market order: ${order.orderId}`,
      );
      return;
    }

    // Market orders should be either FILLED or FAILED
    if (orderStatus.status === 'FILLED') {
      await this.handleFullyFilledOrder(order, orderStatus);
    } else if (
      ['CANCELED', 'REJECTED', 'EXPIRED'].includes(orderStatus.status)
    ) {
      await this.handleFailedOrder(order, orderStatus);
    }
  }

  private async handleFullyFilledOrder(order, orderStatus) {
    try {
      // Update order state to FILLED
      await this.exchangeService.updateSpotOrderState(
        order.orderId,
        STATE_TEXT_MAP['EXCHANGE_ORDER_FILLED'],
      );

      // Update filled amount and execution price
      await this.exchangeService.updateOrderExecutionDetails(
        order.orderId,
        orderStatus.executedQty,
        orderStatus.price || order.limitPrice,
      );

      // Get the release token record
      const releaseToken = await this.exchangeService.getMixinReleaseToken(
        order.orderId,
      );

      if (!releaseToken) {
        this.logger.error(
          `Release token not found for order: ${order.orderId}`,
        );
        return;
      }

      // If token is already released, don't process again (idempotency)
      if (releaseToken.state === STATE_TEXT_MAP['MIXIN_RELEASED']) {
        return;
      }

      // Calculate the amount to release (considering fees)
      let releaseAmount;
      if (order.side === 'buy') {
        // For buy orders, we release the bought asset
        releaseAmount = orderStatus.executedQty;
      } else {
        // For sell orders, we release the proceeds
        releaseAmount = new BigNumber(orderStatus.executedQty)
          .multipliedBy(orderStatus.price || order.limitPrice)
          .toString();
      }

      // Update release token state to COMPLETED
      await this.exchangeService.updateMixinReleaseTokenState(
        order.orderId,
        STATE_TEXT_MAP['MIXIN_RELEASED'],
        releaseAmount,
      );

      // Send success message to user
      await this.snapshotsService.sendOrderCompletionMessage(
        order.userId,
        order.orderId,
        order.type,
        order.side,
        releaseAmount,
        order.symbol,
        orderStatus.price || order.limitPrice,
      );

      this.logger.log(`Successfully completed order: ${order.orderId}`);
    } catch (error) {
      this.logger.error(
        `Error handling fully filled order ${order.orderId}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async handlePartiallyFilledOrder(order, orderStatus) {
    try {
      // Update order state to PARTIALLY_FILLED if not already
      if (order.state !== STATE_TEXT_MAP['EXCHANGE_ORDER_PARTIAL_FILLED']) {
        await this.exchangeService.updateSpotOrderState(
          order.orderId,
          STATE_TEXT_MAP['EXCHANGE_ORDER_PARTIAL_FILLED'],
        );
      }

      // Update filled amount
      await this.exchangeService.updateOrderFilledAmount(
        order.orderId,
        orderStatus.executedQty,
      );

      this.logger.log(
        `Order ${order.orderId} partially filled: ${orderStatus.executedQty}/${order.amount}`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling partially filled order ${order.orderId}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async handleFailedOrder(order, orderStatus) {
    try {
      // Update order state to FAILED
      await this.exchangeService.updateSpotOrderState(
        order.orderId,
        STATE_TEXT_MAP['EXCHANGE_ORDER_CANCELED'],
      );

      // Update release token state to FAILED
      await this.exchangeService.updateMixinReleaseTokenState(
        order.orderId,
        STATE_TEXT_MAP['FAILED'],
      );

      // Get the original snapshot to refund
      const snapshot = await this.snapshotsService.getSnapshotById(
        order.snapshotId,
      );

      if (snapshot) {
        // Refund the user
        await this.snapshotsService.refund(
          snapshot,
          `Your order was ${orderStatus.status.toLowerCase()}. The funds have been returned to your account.`,
        );
      } else {
        this.logger.error(
          `Snapshot not found for failed order: ${order.orderId}`,
        );
      }

      this.logger.log(
        `Order ${order.orderId} failed with status: ${orderStatus.status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error handling failed order ${order.orderId}: ${error.message}`,
        error.stack,
      );
    }
  }

  @OnEvent('spot_trading.create_limit_order')
  async handleLimitOrderCreateEvent(
    details: SpotLimitMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    if (!details || !snapshot) {
      this.logger.error(
        'Invalid arguments passed to handleLimitOrderCreateEvent',
      );
      return;
    }

    try {
      // Validate limit order parameters
      if (!this.validateLimitOrderParameters(details, snapshot)) {
        this.logger.warn(
          `Invalid limit order parameters: ${JSON.stringify(details)}`,
        );
        return await this.snapshotsService.refund(snapshot);
      }

      // Read details.tradingPairId
      const tradingPair = await this.spotdataService.getTradingPairById(
        details.tradingPairId,
      );

      // Find API key for the exchange
      const apiKeyConfig = await this.exchangeService.findFirstAPIKeyByExchange(
        tradingPair.exchange_id,
      );

      if (!apiKeyConfig) {
        this.logger.error(
          `No API key found for exchange: ${tradingPair.exchange_id}`,
        );
        return await this.snapshotsService.refund(snapshot);
      }

      // Generate a unique order ID
      const orderId = randomUUID();

      // Create the order in our database first with CREATED status
      await this.exchangeService.createSpotOrder({
        side: details.action === 'buy' ? 'buy' : 'sell',
        orderId,
        userId: snapshot.opponent_id,
        exchangeName: tradingPair.exchange_id,
        symbol: tradingPair.symbol,
        type: 'limit',
        amount: snapshot.amount,
        baseAssetId: tradingPair.base_asset_id,
        targetAssetId: tradingPair.quote_asset_id,
        limitPrice: details.limitPrice,
        state: STATE_TEXT_MAP['ORDER_CREATED'],
        apiKeyId: apiKeyConfig.key_id,
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
        snapshotId: snapshot.snapshot_id,
      });

      // Prepare for token release after order execution
      await this.exchangeService.addMixinReleaseToken({
        orderId,
        userId: snapshot.opponent_id,
        assetId: tradingPair.base_asset_id,
        amount: snapshot.amount,
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
        state: STATE_TEXT_MAP['MIXIN_RELEASE_INIT'],
      });

      try {
        // Place the order on the exchange
        await this.exchangeService.placeOrder(
          orderId,
          tradingPair.exchange_id,
          true, // limit order
          details.action === 'buy',
          apiKeyConfig.key_id,
          apiKeyConfig.api_key,
          apiKeyConfig.api_secret,
          tradingPair.symbol,
          snapshot.amount,
          details.limitPrice,
        );

        this.logger.log(`Successfully placed limit order: ${orderId}`);
      } catch (error) {
        this.logger.error(
          `Failed to place limit order: ${error.message}`,
          error.stack,
        );
        await this.exchangeService.updateSpotOrderState(
          orderId,
          STATE_TEXT_MAP['EXCHANGE_ORDER_CANCELED'],
        );
        await this.snapshotsService.refund(
          snapshot,
          'Failed to execute order. Please try again later.',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing limit order: ${error.message}`,
        error.stack,
      );
      await this.snapshotsService.refund(
        snapshot,
        'An error occurred while processing your order. Please try again later.',
      );
    }
  }

  @OnEvent('spot_trading.create_market_order')
  async handleMarketOrderCreateEvent(
    details: SpotMarketMemoDetails,
    snapshot: SafeSnapshot,
  ) {
    if (!details || !snapshot) {
      this.logger.error(
        'Invalid arguments passed to handleMarketOrderCreateEvent',
      );
      return;
    }

    try {
      // Validate market order parameters
      if (!this.validateMarketOrderParameters(details, snapshot)) {
        this.logger.warn(
          `Invalid market order parameters: ${JSON.stringify(details)}`,
        );
        return await this.snapshotsService.refund(snapshot);
      }

      // Read details.tradingPairId
      const tradingPair = await this.spotdataService.getTradingPairById(
        details.tradingPairId,
      );

      // Find API key for the exchange
      const apiKeyConfig = await this.exchangeService.findFirstAPIKeyByExchange(
        tradingPair.exchange_id,
      );

      if (!apiKeyConfig) {
        this.logger.error(
          `No API key found for exchange: ${tradingPair.exchange_id}`,
        );
        return await this.snapshotsService.refund(snapshot);
      }

      // Generate a unique order ID
      const orderId = randomUUID();

      // Create the order in our database first with CREATED status
      await this.exchangeService.createSpotOrder({
        side: details.action === 'buy' ? 'buy' : 'sell',
        orderId,
        userId: snapshot.opponent_id,
        exchangeName: tradingPair.exchange_id,
        symbol: tradingPair.symbol,
        type: 'market',
        amount: snapshot.amount,
        baseAssetId: tradingPair.base_asset_id,
        targetAssetId: tradingPair.quote_asset_id,
        state: STATE_TEXT_MAP['ORDER_CREATED'],
        apiKeyId: apiKeyConfig.key_id,
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
        snapshotId: snapshot.snapshot_id,
      });

      // Prepare for token release after order execution
      await this.exchangeService.addMixinReleaseToken({
        orderId,
        userId: snapshot.opponent_id,
        assetId: tradingPair.base_asset_id,
        amount: snapshot.amount,
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
        state: STATE_TEXT_MAP['MIXIN_RELEASE_INIT'],
      });

      try {
        // Place the order on the exchange
        await this.exchangeService.placeOrder(
          orderId,
          tradingPair.exchange_id,
          false, // market order
          details.action === 'buy',
          apiKeyConfig.key_id,
          apiKeyConfig.api_key,
          apiKeyConfig.api_secret,
          tradingPair.symbol,
          snapshot.amount,
        );

        this.logger.log(`Successfully placed market order: ${orderId}`);
      } catch (error) {
        this.logger.error(
          `Failed to place market order: ${error.message}`,
          error.stack,
        );
        await this.exchangeService.updateSpotOrderState(
          orderId,
          STATE_TEXT_MAP['EXCHANGE_ORDER_CANCELED'],
        );
        await this.snapshotsService.refund(
          snapshot,
          'Failed to execute order. Please try again later.',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing market order: ${error.message}`,
        error.stack,
      );
      await this.snapshotsService.refund(
        snapshot,
        'An error occurred while processing your order. Please try again later.',
      );
    }
  }

  private validateLimitOrderParameters(
    details: SpotLimitMemoDetails,
    snapshot: SafeSnapshot,
  ): boolean {
    // Basic validation for limit orders
    if (!details.tradingPairId || !details.limitPrice) {
      return false;
    }

    // Validate price and amount are positive numbers
    if (
      BigNumber(details.limitPrice).lte(0) ||
      BigNumber(snapshot.amount).lte(0)
    ) {
      return false;
    }

    return true;
  }

  private validateMarketOrderParameters(
    details: SpotMarketMemoDetails,
    snapshot: SafeSnapshot,
  ): boolean {
    // Basic validation for market orders
    if (!details.tradingPairId) {
      return false;
    }

    // Validate amount is a positive number
    if (BigNumber(snapshot.amount).lte(0)) {
      return false;
    }

    return true;
  }
}
