// exchange.service.ts
import * as ccxt from 'ccxt';
import BigNumber from 'bignumber.js';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  getRFC3339Timestamp,
  getSymbolByAssetID,
} from 'src/common/helpers/utils';
import {
  STATE_TEXT_MAP,
  SpotOrderStatus,
} from 'src/common/types/orders/states';
import { ExchangePlaceSpotEventDto } from 'src/modules/mixin/exchange/exchange.dto';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/types/exchange/exchange';
import {
  MixinReleaseHistory,
  MixinReleaseToken,
} from 'src/common/types/exchange/mixinRelease';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SpotOrder } from 'src/common/entities/spot-order.entity';

@Injectable()
export class ExchangeService {
  private exchangeInstances: { [key: string]: ccxt.Exchange } = {};
  private readonly logger = new CustomLogger(ExchangeService.name);

  constructor(
    private exchangeRepository: ExchangeRepository,
    private eventEmitter: EventEmitter2,
  ) {
    this.loadAPIKeys();
  }

  private async loadAPIKeys() {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();
    if (apiKeys.length === 0) {
      this.logger.error('No API Keys loaded');
      return;
    }
    for (const key of apiKeys) {
      const keyId = key.key_id;
      const exchangeName = key.exchange;
      const apiKey = key.api_key;
      const apiSecret = key.api_secret;

      if (!this.exchangeInstances[keyId]) {
        this.exchangeInstances[keyId] = new ccxt[exchangeName]({
          apiKey,
          secret: apiSecret,
        });
      }
    }
  }

  async getBalance(
    exchange: string,
    apiKey: string,
    apiSecret: string,
    symbol: string,
  ): Promise<any> {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
    });

    try {
      return await e.fetchBalance({ currency: symbol });
    } catch (error) {
      console.error(`Error fetching balance for ${exchange}: ${error.message}`);
      throw error;
    }
  }

  async checkExchangeBalanceEnough(
    exchange: string,
    apiKey: string,
    apiSecret: string,
    symbol: string,
    amount: string,
  ) {
    const balance = await this.getBalance(exchange, apiKey, apiSecret, symbol);
    return BigNumber(amount).isLessThan(balance);
  }

  async pickAPIKeyOnDemand(
    exchange: string,
    asset_id: string,
    amount: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    const symbol = getSymbolByAssetID(asset_id);
    const apiKeys = await this.exchangeRepository.readAllAPIKeysByExchange(
      exchange,
    );
    apiKeys.forEach(async (key) => {
      if (
        await this.checkExchangeBalanceEnough(
          key.exchange,
          key.api_key,
          key.api_secret,
          amount,
          symbol,
        )
      ) {
        return {
          type: 'success',
          exchange,
          id: key.key_id,
          api_key: key.api_key,
          secret: key.api_secret,
        };
      }
    });
    return {
      type: 'error',
      error: `no API key available (${exchange}:${
        symbol || asset_id
      }:${amount})`,
    };
  }

  async estimateSpotAmount(
    exchange: string,
    symbol: string,
    buy: boolean,
    amount: string,
    limit_price?: string,
  ): Promise<string> {
    const exchangeInstance = this.exchangeInstances[exchange];

    if (!exchangeInstance) {
      throw new Error(`Exchange instance for ${exchange} not found`);
    }

    // For limit orders, calculate based on the provided limit_price
    if (limit_price) {
      if (buy) {
        // Assuming amount is in target asset for buying, finalAmount is in base asset
        const finalAmount = new BigNumber(amount).div(limit_price).toString();
        return finalAmount;
      } else {
        // Assuming amount is in base asset for selling, finalAmount is in target asset
        const finalAmount = new BigNumber(amount)
          .multipliedBy(limit_price)
          .toString();
        return finalAmount;
      }
    } else {
      // For market orders, fetch the latest price as a basis for our calculation
      // This is a simplified estimation; it doesn't account for slippage or the depth of the order book.
      const ticker = await exchangeInstance.fetchTicker(symbol);
      const latestPrice = new BigNumber(ticker.last);

      if (buy) {
        // For market buy, assuming amount is in target asset, estimate how much base asset we can buy
        const estimatedBaseAmount = new BigNumber(amount)
          .div(latestPrice)
          .toString();
        return estimatedBaseAmount;
      } else {
        // For market sell, assuming amount is in base asset, estimate how much target asset we'll receive
        const estimatedTargetAmount = latestPrice
          .multipliedBy(amount)
          .toString();
        return estimatedTargetAmount;
      }
    }
  }

  // DB related
  async createSpotOrder(order: ExchangePlaceSpotEventDto) {
    return await this.exchangeRepository.createSpotOrder(order);
  }

  async updateSpotOrderState(orderId: string, state: SpotOrderStatus) {
    await this.exchangeRepository.updateSpotOrderUpdatedAt(
      orderId,
      getRFC3339Timestamp(),
    );
    return await this.exchangeRepository.updateSpotOrderState(orderId, state);
  }

  async updateSpotOrderApiKeyId(orderId: string, api_key_id: string) {
    await this.exchangeRepository.updateSpotOrderUpdatedAt(
      orderId,
      getRFC3339Timestamp(),
    );
    return await this.exchangeRepository.updateSpotOrderApiKeyId(
      orderId,
      api_key_id,
    );
  }

  async readOrderById(orderId: string): Promise<SpotOrder> {
    return await this.exchangeRepository.readOrderByID(orderId);
  }

  async readOrderByState(state: SpotOrderStatus): Promise<SpotOrder> {
    return await this.exchangeRepository.readOrderByState(state);
  }

  async addMixinReleaseToken(data: MixinReleaseToken) {
    return await this.exchangeRepository.addMixinReleaseToken(data);
  }

  async readMixinReleaseToken(orderId: string) {
    return await this.exchangeRepository.readMixinReleaseToken(orderId);
  }

  async addMixinReleaseHistory(data: MixinReleaseHistory) {
    return await this.exchangeRepository.addMixinReleaseHistory(data);
  }

  async readMixinReleaseHistory(orderId: string) {
    return await this.exchangeRepository.readMixinReleaseHistory(orderId);
  }

  async placeOrder(
    orderId: string,
    exchange: string,
    limit: boolean,
    buy: boolean,
    apiKeyId: string,
    apiKey: string,
    apiSecret: string,
    symbol: string,
    amount: string,
    limit_price?: string,
  ) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
    });

    if (limit && buy) {
      return await e.createLimitBuyOrder(symbol, amount, limit_price);
    }
    if (limit && !buy) {
      return await e.createLimitSellOrder(symbol, amount, limit_price);
    }
    if (!limit && buy) {
      return await e.createMarketBuyOrder(symbol, amount);
    }
    if (!limit && !buy) {
      return await e.createMarketSellOrder(symbol, amount);
    }

    await this.updateSpotOrderState(
      orderId,
      STATE_TEXT_MAP['EXCHANGE_ORDER_PLACED'],
    );
    await this.updateSpotOrderApiKeyId(orderId, apiKeyId);
  }

  @Cron('*/3 * * * * *') // Every 3 seconds
  async placedOrderUpdater() {
    const orders = await this.readOrderByState(
      STATE_TEXT_MAP['EXCHANGE_ORDER_PLACED'],
    );

    if (orders.length === 0) {
      return;
    }

    orders.forEach(async (o) => {
      const instance = this.exchangeInstances[o.exchangeIndex];
      if (!instance.has['fetchOrder']) {
        return await this.updateSpotOrderState(
          o.orderId,
          STATE_TEXT_MAP['EXCHANGE_DOESNT_SUPPORT_FETCH_ORDER'],
        );
      }

      const order = await instance.fetchOrder(o.orderId);

      // TODO: All these states needs to be tested
      // Determine order state and update
      if (order.status === 'open') {
        if (order.filled === 0) {
          return;
        }
        if (order.filled != order.amount) {
          await this.updateSpotOrderState(
            o.orderId,
            STATE_TEXT_MAP['EXCHANGE_ORDER_PARTIAL_FILLED'],
          );
          return;
        }
      }
      if (order.status === 'canceled') {
        await this.updateSpotOrderState(
          o.orderId,
          STATE_TEXT_MAP['EXCHANGE_ORDER_CANCELED'],
        );
        return;
      }
      if (order.status === 'closed') {
        await this.updateSpotOrderState(
          o.orderId,
          STATE_TEXT_MAP['EXCHANGE_ORDER_FILLED'],
        );
      }

      // TODO: add a final amount field to order and store in db. Use this value when release token

      // If order state is finished, jump to step 4, withdraw token in mixin (mixin.listener.ts)
      const releaseOrder = await this.readMixinReleaseToken(o.orderId);
      this.eventEmitter.emit('mixin.release', {
        orderId: releaseOrder.orderId,
        userId: releaseOrder.userId,
        assetId: releaseOrder.assetId,
        amount: releaseOrder.amount,
      });
    });
  }
}
