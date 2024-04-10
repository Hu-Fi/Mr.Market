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
import { APIKeysConfig } from 'src/common/entities/api-keys.entity';
import { ExchangeDepositDto, ExchangeWithdrawalDto } from './exchange.dto';
import { AggregatedBalances } from 'src/common/types/rebalance/map';

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
    if (!apiKeys) {
      this.logger.error('No API Keys loaded');
      return;
    }
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

  async readAllAPIKeys() {
    return await this.exchangeRepository.readAllAPIKeys();
  }

  async getAllAPIKeysBalance() {
    try {
      const apiKeys: APIKeysConfig[] = await this.readAllAPIKeys();
      const balancePromises = apiKeys.map((apiKeyConfig) =>
        this.getBalance(
          apiKeyConfig.exchange,
          apiKeyConfig.api_key,
          apiKeyConfig.api_secret,
        )
          .then((balance) => ({
            key_id: apiKeyConfig.key_id,
            exchange: apiKeyConfig.exchange,
            name: apiKeyConfig.name,
            balance,
          }))
          .catch((error) => {
            this.logger.error(
              `Failed to get balance for ${apiKeyConfig.name} on ${apiKeyConfig.exchange}: ${error.message}`,
            );
            return null;
          }),
      );

      const balances = await Promise.allSettled(balancePromises);
      const successfulBalances = balances
        .filter(
          (result) => result.status === 'fulfilled' && result.value !== null,
        )
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      return successfulBalances;
    } catch (error) {
      this.logger.error(
        `Error fetching all API keys balances: ${error.message}`,
      );
      throw error;
    }
  }

  aggregateBalancesByExchange(successfulBalances: any[]): AggregatedBalances {
    return successfulBalances.reduce((acc, curr) => {
      const { exchange, balance } = curr;

      if (!acc[exchange]) {
        acc[exchange] = { free: {}, used: {}, total: {} };
      }

      Object.keys(balance).forEach((balanceType) => {
        const balanceDetails = balance[balanceType];

        Object.entries(balanceDetails).forEach(([currency, amount]) => {
          if (!acc[exchange][balanceType][currency]) {
            acc[exchange][balanceType][currency] = 0;
          }
          acc[exchange][balanceType][currency] += amount;
        });
      });

      return acc;
    }, {});
  }

  async getBalance(
    exchange: string,
    apiKey: string,
    apiSecret: string,
  ): Promise<any> {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
    });

    try {
      const b = await e.fetchBalance();
      function filterZeroBalances(balances) {
        return Object.fromEntries(
          Object.entries(balances).filter(([, value]) => value !== 0),
        );
      }
      return {
        free: filterZeroBalances(b['free']),
        used: filterZeroBalances(b['used']),
        total: filterZeroBalances(b['total']),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching balance for ${exchange}: ${error.message}`,
      );
      throw error;
    }
  }

  async getBalanceBySymbol(
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
      const b = await e.fetchBalance({ currency: symbol });
      return b['free'];
    } catch (error) {
      this.logger.error(
        `Error fetching balance for ${exchange}: ${error.message}`,
      );
      throw error;
    }
  }

  async getDepositAddress(data: ExchangeDepositDto) {
    const key = await this.readAPIKey(data.apiKeyId);
    if (!key) {
      return;
    }
    return await this._getDepositAddress({
      ...data,
      apiKey: key.api_key,
      apiSecret: key.api_secret,
    });
  }

  async _getDepositAddress({
    exchange,
    apiKey,
    apiSecret,
    symbol,
    network,
  }: {
    exchange: string;
    apiKey: string;
    apiSecret: string;
    symbol: string;
    network: string;
  }) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
    });
    if (!e.has['fetchDepositAddress']) {
      this.logger.error(`${exchange} doesn't support fetchDepositAddress()`);
      return;
    }
    try {
      // The network parameter needs a map. It's case sensitive
      const depositAddress = await e.fetchDepositAddress(symbol, { network });
      return {
        address: depositAddress['address'],
        memo: depositAddress['tag'] || '',
      };
    } catch (error) {
      if (error instanceof ccxt.InvalidAddress) {
        this.logger.log(`The address for ${symbol} does not exist yet`);
        if (e.has['createDepositAddress']) {
          this.logger.log(
            `Attempting to create a deposit address for ${symbol}...`,
          );

          try {
            const createResult = await e.createDepositAddress(symbol);

            if (createResult) {
              this.logger.log(
                `Successfully created a deposit address for ${symbol} fetching the deposit address now...`,
              );
            }

            try {
              const fetchResult = await e.fetchDepositAddress(symbol);

              this.logger.log(
                `Successfully fetched deposit address for ${symbol}`,
              );
              this.logger.log(fetchResult);
            } catch (e) {
              this.logger.log(
                `Failed to fetch deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
              );
            }
          } catch (e) {
            this.logger.log(
              `Failed to create deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
            );
          }
        } else {
          this.logger.log(
            'The exchange does not support createDepositAddress()',
          );
        }
      } else {
        this.logger.log(
          `There was an error while fetching deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
        );
      }
    }
  }

  async createWithdrawal(data: ExchangeWithdrawalDto) {
    const key = await this.readAPIKey(data.apiKeyId);
    if (!key) {
      return;
    }
    await this._createWithdrawal({
      ...data,
      apiKey: key.api_key,
      apiSecret: key.api_secret,
    });
  }

  async _createWithdrawal({
    exchange,
    apiKey,
    apiSecret,
    symbol,
    network,
    address,
    tag,
    amount,
  }: {
    exchange: string;
    apiKey: string;
    apiSecret: string;
    symbol: string;
    network: string;
    address: string;
    tag: string;
    amount: string;
  }) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
    });

    if (!e.has['withdraw']) {
      this.logger.error(`${exchange} does not support withdrawals.`);
      throw new Error(`${exchange} does not support withdrawals.`);
    }

    try {
      const withdrawal = await e.withdraw(symbol, amount, address, tag, {
        network,
      });
      return withdrawal; // This will return the response from the exchange, which usually includes a transaction ID.
    } catch (error) {
      if (error instanceof ccxt.NetworkError) {
        this.logger.error(
          `Network error while attempting withdrawal on ${exchange}: ${error.message}`,
        );
        throw new Error(
          'Network error during withdrawal operation. Please try again later.',
        );
      } else if (error instanceof ccxt.ExchangeError) {
        this.logger.error(
          `Exchange error while attempting withdrawal on ${exchange}: ${error.message}`,
        );
        throw new Error(
          'Exchange error during withdrawal operation. Please check the provided parameters.',
        );
      } else if (error instanceof ccxt.InvalidAddress) {
        this.logger.error(
          `Invalid address provided for withdrawal on ${exchange}: ${error.message}`,
        );
        throw new Error(
          'Invalid address provided for withdrawal. Please check the address and try again.',
        );
      } else {
        // Generic error handling
        this.logger.error(
          `An unexpected error occurred during withdrawal on ${exchange}: ${error.message}`,
        );
        throw new Error(
          'An unexpected error occurred during the withdrawal operation. Please try again later.',
        );
      }
    }
  }

  async checkExchangeBalanceEnough(
    exchange: string,
    apiKey: string,
    apiSecret: string,
    symbol: string,
    amount: string,
  ) {
    const balance = await this.getBalanceBySymbol(
      exchange,
      apiKey,
      apiSecret,
      symbol,
    );
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

  // async pickAPIKeyForRebalance(symbol: string, mixinAmount: string) {
  // Get an api key with sufficient balance
  // symbol, amount;
  // }

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

  async getAllSpotOrders(): Promise<SpotOrder[]> {
    return this.exchangeRepository.readAllSpotOrders();
  }

  // DB related
  async addApiKey(key: APIKeysConfig) {
    return await this.exchangeRepository.addAPIKey(key);
  }

  async readAPIKey(keyId: string) {
    return await this.exchangeRepository.readAPIKey(keyId);
  }

  async findFirstAPIKeyByExchange(
    exchange: string,
  ): Promise<APIKeysConfig | null> {
    const apiKeys = await this.exchangeRepository.readAllAPIKeysByExchange(
      exchange,
    );
    if (!apiKeys) {
      return null;
    }
    return apiKeys[0];
  }

  async removeAPIKey(keyId: string) {
    return await this.exchangeRepository.removeAPIKey(keyId);
  }

  async createSpotOrder(order: SpotOrder) {
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

  async readOrdersByUser(userId: string) {
    return await this.exchangeRepository.readOrderByUser(userId);
  }

  async readOrderById(orderId: string): Promise<SpotOrder> {
    return await this.exchangeRepository.readOrderByID(orderId);
  }

  async readOrdersByState(state: SpotOrderStatus): Promise<SpotOrder[]> {
    return await this.exchangeRepository.readOrdersByState(state);
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
      await e.createLimitBuyOrder(symbol, amount, limit_price);
    } else if (limit && !buy) {
      await e.createLimitSellOrder(symbol, amount, limit_price);
    } else if (!limit && buy) {
      await e.createMarketBuyOrder(symbol, amount);
    } else if (!limit && !buy) {
      await e.createMarketSellOrder(symbol, amount);
    }

    await this.updateSpotOrderState(
      orderId,
      STATE_TEXT_MAP['EXCHANGE_ORDER_PLACED'],
    );
    await this.updateSpotOrderApiKeyId(orderId, apiKeyId);
  }

  @Cron('*/3 * * * * *') // Every 3 seconds
  async placedOrderUpdater() {
    const orders = await this.readOrdersByState(
      STATE_TEXT_MAP['EXCHANGE_ORDER_PLACED'],
    );

    if (orders.length === 0) {
      return;
    }

    await Promise.all(
      orders.map(async (o) => {
        const instance = this.exchangeInstances[o.exchangeName];
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
      }),
    );
  }
}
