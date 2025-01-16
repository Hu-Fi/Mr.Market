import * as ccxt from 'ccxt';
import BigNumber from 'bignumber.js';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';
import {
  STATE_TEXT_MAP,
  SpotOrderStatus,
} from 'src/common/types/orders/states';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';
import {
  MixinReleaseHistory,
  MixinReleaseToken,
} from 'src/common/types/exchange/mixinRelease';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SpotOrder } from 'src/common/entities/spot-order.entity';
import { exchangeAPIKeysConfig } from 'src/common/entities/exchange-api-keys.entity';
import {
  ExchangeAPIKeysConfigDto,
  ExchangeDepositDto,
  ExchangeWithdrawalDto,
} from './exchange.dto';
import { AggregatedBalances } from 'src/common/types/rebalance/map';
import { Currencies } from 'ccxt/js/src/base/types';

@Injectable()
export class ExchangeService {
  private exchangeInstances: { [key: string]: ccxt.Exchange } = {};
  private readonly logger = new CustomLogger(ExchangeService.name);

  constructor(
    private exchangeRepository: ExchangeRepository,
    private eventEmitter: EventEmitter2,
  ) {
    try {
      this.loadAPIKeys();
    } catch (error) {
      this.logger.error(`Error loading API keys: ${error.message}`);
    }
  }

  private async loadAPIKeys() {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();
    if (!apiKeys?.length) {
      this.logger.warn('No API Keys loaded');
      return;
    }
    for (const key of apiKeys) {
      const instance = this.handleInstanceInit(key);
      if (!instance) {
        continue;
      }
      this.exchangeInstances[key.exchange] = instance;
    }
  }

  private handleInstanceInit(key: exchangeAPIKeysConfig) {
    const requiredFields = Object.entries(
      new ccxt[key.exchange]().requiredCredentials,
    )
      .filter(([, value]) => value)
      .map(([key]) => key);
    this.logger.debug(
      `Initializing ${key.exchange} instance: ${JSON.stringify(
        requiredFields,
      )}`,
    );

    if ('password' in requiredFields) {
      return new ccxt[key.exchange]({
        apiKey: key.api_key,
        secret: key.api_secret,
        password: key.api_extra,
      });
    }
    return new ccxt[key.exchange]({
      apiKey: key.api_key,
      secret: key.api_secret,
    });
  }

  private removeSensitiveData(apiKeys: exchangeAPIKeysConfig[]) {
    return apiKeys.map((key) => {
      delete key.api_secret;
      delete key.api_extra;
      return key;
    });
  }

  private async readAllAPIKeys() {
    return await this.exchangeRepository.readAllAPIKeys();
  }

  async readAllAPIKeysWithoutSecret() {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();
    return this.removeSensitiveData(apiKeys);
  }

  async getAllAPIKeysBalance() {
    try {
      const apiKeys: exchangeAPIKeysConfig[] = await this.readAllAPIKeys();
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

  // getAllAPIKeysBalance return all balances based on api key
  // aggregateBalancesByExchange concrate all api keys balance by exchange
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

  async getBalanceByKeyLabel(keyLabel: string) {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();
    this.logger.debug(
      `getBalanceByKeyLabel: Getting balance for key label: ${keyLabel}`,
    );
    this.logger.debug(
      `getBalanceByKeyLabel: API keys: ${JSON.stringify(apiKeys)}`,
    );

    const apiKey = apiKeys.find((key) => key.key_id.toString() === keyLabel);
    this.logger.debug(
      `getBalanceByKeyLabel: API key: ${JSON.stringify(apiKey)}`,
    );
    if (!apiKey) {
      this.logger.error(
        `getBalanceByKeyLabel: Key label not found: ${keyLabel}`,
      );
      return null;
    }
    return await this.getBalance(
      apiKey.exchange,
      apiKey.api_key,
      apiKey.api_secret,
    );
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
    apiKey: string,
    apiSecret: string,
    apiExtra: string,
    exchange: string,
    symbol: string,
  ): Promise<any> {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
      password: apiExtra || '',
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

  async getAllCurrenciesByKeyId(keyId: string) {
    const key = await this.readAPIKey(keyId);
    if (!key) {
      return;
    }
    // Some exchange like okx requires credentials to fetch currencies
    const e = new ccxt[key.exchange]({
      apiKey: key.api_key,
      secret: key.api_secret,
      password: key.api_extra || '',
    });
    const currencies = await e.fetchCurrencies();
    this.logger.debug(
      `Fetched ${currencies.length} currencies for ${key.exchange}`,
    );
    return currencies;
  }

  async getCurrencyInfo(keyId: string, symbol: string): Promise<Currencies> {
    const key = await this.readAPIKey(keyId);
    if (!key) {
      return;
    }
    const e = new ccxt[key.exchange]({
      apiKey: key.api_key,
      secret: key.api_secret,
      password: key.api_extra || '',
    });
    const currencies = await e.fetchCurrencies();
    return currencies[symbol];
  }

  async getTicker(
    apiKey: string,
    apiSecret: string,
    apiExtra: string,
    exchange: string,
    symbol: string,
  ) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
      password: apiExtra || '',
    });
    const ticker = await e.fetchTicker(symbol);
    return ticker;
  }

  async getDepositAddress(data: ExchangeDepositDto) {
    const key = await this.readAPIKey(data.apiKeyId);
    if (!key) {
      return;
    }
    this.logger.debug(
      `Get deposit address for ${key.exchange} ${data.symbol} ${data.network}`,
      `key: ${key.exchange} ${key.api_key} ${key.api_secret}`,
      `data: ${data.symbol} ${data.network}`,
    );
    return await this._getDepositAddress({
      ...data,
      exchange: key.exchange,
      apiKey: key.api_key,
      apiSecret: key.api_secret,
      apiExtra: key.api_extra || '',
    });
  }

  async _getDepositAddress({
    exchange,
    apiKey,
    apiSecret,
    symbol,
    network,
    apiExtra,
  }: {
    exchange: string;
    symbol: string;
    network: string;
    apiKey: string;
    apiSecret: string;
    apiExtra?: string;
  }) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
      password: apiExtra || '',
    });
    if (!e.has['fetchDepositAddress']) {
      this.logger.error(`${exchange} doesn't support fetchDepositAddress()`);
      return;
    }
    try {
      const currencies = await e.fetchCurrencies();
      const currencyInfo = currencies[symbol];
      this.logger.debug(
        `Fetched currency info: ${JSON.stringify(currencyInfo)}`,
      );

      let networkInfo;
      let minium_deposit_amount = '0';
      let minium_withdrawal_amount = '0';
      let maxium_deposit_amount = '0';
      let maxium_withdrawal_amount = '0';

      if (currencyInfo['networks']) {
        networkInfo = currencyInfo['networks'][network];
      }

      if (networkInfo && networkInfo['limits']) {
        minium_deposit_amount = networkInfo['limits']['deposit']['min'] || '0';
        minium_withdrawal_amount =
          networkInfo['limits']['withdraw']['min'] || '0';
        maxium_deposit_amount = networkInfo['limits']['deposit']['max'] || '0';
        maxium_withdrawal_amount =
          networkInfo['limits']['withdraw']['max'] || '0';
      }

      const depositAddress = await e.fetchDepositAddress(symbol, { network });
      this.logger.debug(
        `fetchDepositAddress: ${JSON.stringify(depositAddress)}`,
      );
      return {
        currency: symbol,
        minium_deposit_amount,
        minium_withdrawal_amount,
        maxium_deposit_amount,
        maxium_withdrawal_amount,
        address: depositAddress['address'],
        memo: depositAddress['tag'] || '',
        network: depositAddress['network'] || '',
      };
    } catch (error) {
      if (error instanceof ccxt.InvalidAddress) {
        this.logger.warn(`The address for ${symbol} does not exist yet`);

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
              const depositAddress = await e.fetchDepositAddress(symbol);

              return {
                currency: symbol,
                address: depositAddress['address'],
                memo: depositAddress['tag'] || '',
                network: depositAddress['network'] || '',
              };
            } catch (e) {
              this.logger.error(
                `Failed to fetch deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
              );
            }
          } catch (e) {
            this.logger.error(
              `Failed to create deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
            );
          }
        } else {
          this.logger.warn(
            'The exchange does not support createDepositAddress()',
          );
        }
      } else {
        this.logger.error(
          `There was an error while fetching deposit address for ${symbol} ${error.constructor.name} ${error.message}`,
        );
      }
      throw error;
    }
  }

  async getWithdrawalFee(data: ExchangeWithdrawalDto) {
    const key = await this.readAPIKey(data.apiKeyId);
    if (!key) {
      return;
    }
    const e = new ccxt[key.exchange]({
      apiKey: key.api_key,
      secret: key.api_secret,
      password: key.api_extra || '',
    });
    const fee = await e.fetchWithdrawalFee(data.symbol, data.network);
    return fee;
  }

  async createWithdrawal(data: ExchangeWithdrawalDto) {
    const key = await this.readAPIKey(data.apiKeyId);
    if (!key) {
      return;
    }
    const withdrawResult = await this._createWithdrawal({
      ...data,
      apiKey: key.api_key,
      apiSecret: key.api_secret,
      apiExtra: key.api_extra || '',
    });
    if (!withdrawResult) {
      return;
    }
    return await this.exchangeRepository.addWithdrawalRecord({});
  }

  async _createWithdrawal({
    exchange,
    apiKey,
    apiSecret,
    apiExtra,
    symbol,
    network,
    address,
    tag,
    amount,
  }: {
    exchange: string;
    apiKey: string;
    apiSecret: string;
    apiExtra: string;
    symbol: string;
    network: string;
    address: string;
    tag: string;
    amount: string;
  }) {
    const e = new ccxt[exchange]({
      apiKey,
      secret: apiSecret,
      password: apiExtra || '',
    });

    if (!e.has['withdraw']) {
      this.logger.error(`${exchange} does not support withdrawals.`);
      throw new Error(`${exchange} does not support withdrawals.`);
    }

    try {
      const withdrawal = await e.withdraw(symbol, amount, address, tag, {
        network,
      });
      return withdrawal;
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
  async addApiKey(key: ExchangeAPIKeysConfigDto) {
    const exchangeInstance = new ccxt[key.exchange]({
      apiKey: key.api_key,
      secret: key.api_secret,
      password: key.api_extra || '',
    });

    const balance = await exchangeInstance.fetchBalance();
    if (balance) {
      return await this.exchangeRepository.addAPIKey({
        ...key,
        key_id: '1',
      });
    } else {
      throw new Error('Invalid API key or secret');
    }
  }

  async readAPIKey(keyId: string) {
    return await this.exchangeRepository.readAPIKey(keyId);
  }

  async findFirstAPIKeyByExchange(
    exchange: string,
  ): Promise<exchangeAPIKeysConfig | null> {
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
