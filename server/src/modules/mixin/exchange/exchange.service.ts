// exchange.service.ts
import * as ccxt from 'ccxt';
import BigNumber from 'bignumber.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSymbolByAssetID } from 'src/common/helpers/utils';
import { SpotOrderStatus } from 'src/common/types/orders/orders';
import { ExchangePlaceSpotEventDto } from 'src/modules/mixin/exchange/exchange.dto';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';
import { SpotOrderType } from 'src/common/types/memo/memo';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/types/exchange/exchange';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ExchangeService {
  private exchangeInstances: { [key: string]: ccxt.Exchange } = {};

  constructor(
    @InjectRepository(ExchangeRepository)
    private exchangeRepository: ExchangeRepository,
  ) {}

  async onModuleInit() {
    await this.loadAPIKeys();
  }

  private async loadAPIKeys() {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();

    for (const key of apiKeys) {
      const exchange = key.exchangeIndex;
      const apiKey = key.api_key;
      const apiSecret = key.api_secret;

      if (!this.exchangeInstances[exchange]) {
        this.exchangeInstances[exchange] = new ccxt[exchange]({
          apiKey,
          secret: apiSecret,
        });
      }
    }
  }

  private async getBalance(
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

  // async estimateSpotAmount(
  //   exchange: string,
  //   symbol: string,
  //   buy: boolean,
  //   amount: string,
  //   limit_price?: string,
  // ): Promise<string> {
  //   const exchangeInstance = this.exchangeInstances[exchange];

  //   if (!exchangeInstance) {
  //     throw new Error(`Exchange instance for ${exchange} not found`);
  //   }
  // }

  // DB related
  async createSpotOrder(order: ExchangePlaceSpotEventDto) {
    return await this.exchangeRepository.createSpotOrder(order);
  }

  async updateSpotOrderState(order_id: string, state: SpotOrderStatus) {
    return await this.exchangeRepository.updateSpotOrderState(order_id, state);
  }

  async getOrderByState(state: SpotOrderStatus) {
    return await this.exchangeRepository.getOrderByState(state);
  }

  async placeOrder(
    orderId: string,
    exchange: string,
    limit: boolean,
    buy: boolean,
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

    await this.updateSpotOrderState(orderId, '1001');
  }

  // Every 3 seconds
  @Cron('*/20 * * * * *')
  async placedOrderUpdater() {
    const orders = await this.getOrderByState('1001');
    // Fetch order if method available
    console.log(orders);
  }
}
