import { randomUUID } from 'crypto';
import BigNumber from 'bignumber.js';
import { Injectable } from '@nestjs/common';
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
export class SpotOrderListener {
  private readonly logger = new CustomLogger(SpotOrderListener.name);

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly snapshotsService: SnapshotsService,
    private readonly spotdataService: SpotdataService,
  ) {}

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
        state: STATE_TEXT_MAP['CREATED'],
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
        state: STATE_TEXT_MAP['CREATED'],
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
          STATE_TEXT_MAP['FAILED'],
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
        state: STATE_TEXT_MAP['CREATED'],
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
        state: STATE_TEXT_MAP['CREATED'],
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
          STATE_TEXT_MAP['FAILED'],
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
