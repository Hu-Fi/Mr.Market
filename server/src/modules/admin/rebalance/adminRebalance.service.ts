// Admin Rebalance service
import { Cache } from 'cache-manager';
import { BigNumber } from 'bignumber.js';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';

@Injectable()
export class AdminRebalanceService {
  private readonly logger = new CustomLogger(AdminRebalanceService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private exchangeService: ExchangeService,
    private snapshotService: SnapshotsService,
  ) {}

  private cachingTTL = 15; // 15 seconds

  // 1. Get all balances
  async getAllBalances(disableCache: string) {
    const cacheKey = `admin-rebalance-balances`;
    this.logger.debug('Getting all balances disableCache: ' + disableCache);
    if (disableCache == 'false') {
      this.logger.debug('Getting all balances from cache');
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        this.logger.debug('Balances retrieved from cache ' + cachedData);
        return cachedData;
      }
    }
    this.logger.debug('Getting all balances from database');
    const snapshot = await this.snapshotService.getAllAssetBalancesCCXT();
    const exchange = await this.exchangeService.getAllAPIKeysBalance();
    const result = [snapshot, ...exchange];
    if (result) {
      this.logger.debug('Caching all balances');
      await this.cacheService.set(cacheKey, result, this.cachingTTL);
    }
    return result;
  }

  // 2. Get balance by key label
  async getBalanceByKeyLabel(keyLabel: string) {
    this.logger.debug(`Getting balance for key label: ${keyLabel}`);
    return await this.exchangeService.getBalanceByKeyLabel(keyLabel);
  }

  // 3. Get balance by mixin
  async getBalanceByMixin() {
    this.logger.debug(`Getting balance for mixin`);
    return await this.snapshotService.getAllAssetBalances();
  }

  // Get transfer info
  // async getTransferInfo(
  //   fromKeyId: string,
  //   toKeyId: string,
  //   symbol: string,
  //   chain: string,
  //   amount: string,
  // ) {
  //   const fromExchangeKey = await this.exchangeService.readAPIKey(fromKeyId);
  //   const fromExchange = fromExchangeKey.exchange;
  //   const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
  //     fromExchangeKey.api_key,
  //     fromExchangeKey.api_secret,
  //     fromExchangeKey.api_extra,
  //     fromExchange,
  //     symbol,
  //   );
  //   const fromExchangeMinWithdrawalAmount =
  //     fromExchangeCurrencyInfo.withdrawal_min_size;
  //   const fromExchangeFee = fromExchangeCurrencyInfo.fee;
  //   const toExchangeKey = await this.exchangeService.readAPIKey(toKeyId);
  //   const toExchange = toExchangeKey.exchange;
  //   const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
  //     toExchangeKey.api_key,
  //     toExchangeKey.api_secret,
  //     toExchangeKey.api_extra,
  //     toExchange,
  //     symbol,
  //   );
  //   const toExchangeMinDepositAmount = toExchangeCurrencyInfo.deposit_min_size;
  // }

  // 3. Transfer from mixin/exchange to exchange/mixin
  async transferBetweenExchanges(
    fromKeyId: string,
    toKeyId: string,
    symbol: string,
    chain: string,
    amount: string,
  ) {
    this.logger.log(
      `Transferring from ${fromKeyId} to ${toKeyId} ${symbol} ${chain} ${amount}`,
    );
    // Minium withdrawal amount of fromExchange
    // If amount is less than minium withdrawal amount, return error
    const fromExchangeKey = await this.exchangeService.readAPIKey(fromKeyId);
    const fromExchange = fromExchangeKey.exchange;
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromExchangeKey.api_key,
      fromExchangeKey.api_secret,
      fromExchangeKey.api_extra,
      fromExchange,
      symbol,
    );

    const toExchangeKey = await this.exchangeService.readAPIKey(toKeyId);
    const toExchange = toExchangeKey.exchange;
    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toExchangeKey.api_key,
      toExchangeKey.api_secret,
      toExchangeKey.api_extra,
      toExchange,
      symbol,
    );

    this.logger.debug(
      `From exchange currency info: ${JSON.stringify(
        fromExchangeCurrencyInfo,
      )}`,
    );

    if (!fromExchangeCurrencyInfo.networks[chain]) {
      throw new Error(`Chain ${chain} not supported by fromExchange`);
    }
    if (!toExchangeCurrencyInfo.networks[chain]) {
      throw new Error(`Chain ${chain} not supported by toExchange`);
    }

    const fromExchangeMinWithdrawalAmount =
      fromExchangeCurrencyInfo.networks[chain].limits.withdraw.min;
    const fromExchangeMaxWithdrawalAmount =
      fromExchangeCurrencyInfo.networks[chain].limits.withdraw.max;
    const fromExchangeWithdrawalFee =
      fromExchangeCurrencyInfo.networks[chain].fee;
    const fromExchangeWithdrawalEnabled =
      fromExchangeCurrencyInfo.networks[chain].withdraw;
    if (new BigNumber(amount).isLessThan(fromExchangeMinWithdrawalAmount)) {
      throw new Error(`Amount is less than the minimum withdrawal amount`);
    }

    const toExchangeMinDepositAmount =
      toExchangeCurrencyInfo.networks[chain].limits.deposit.min;
    const toExchangeMaxDepositAmount =
      toExchangeCurrencyInfo.networks[chain].limits.deposit.max;
    const toExchangeDepositFee = toExchangeCurrencyInfo.networks[chain].fee;
    const toExchangeDepositEnabled =
      toExchangeCurrencyInfo.networks[chain].deposit;

    if (new BigNumber(amount).isLessThan(toExchangeMinDepositAmount)) {
      throw new Error(`Amount is less than the minimum deposit amount`);
    }

    const fromExchangeBalance = await this.exchangeService.getBalanceByKeyLabel(
      fromKeyId,
    );
    if (new BigNumber(fromExchangeBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in fromExchange`);
    }

    const toExchangeDepositAddress =
      await this.exchangeService.getDepositAddress({
        apiKeyId: toKeyId,
        symbol,
        network: chain,
      });

    if (!toExchangeDepositAddress) {
      throw new Error(`Deposit address not found for toExchange`);
    }

    try {
      await this.exchangeService.createWithdrawal({
        apiKeyId: fromKeyId,
        symbol,
        network: chain,
        exchange: fromExchange,
        address: toExchangeDepositAddress.address,
        amount,
        tag: '',
      });
      this.logger.log(`Transfer successful from ${fromKeyId} to ${toKeyId}`);
      // Write to rebalance history
    } catch (error) {
      this.logger.error(`Transfer failed: ${error.message}`);
      // Write to rebalance history
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async transferFromMixin(transferDto: any) {
    this.logger.log(`Transferring from mixin to exchange ${transferDto}`);
    // TODO: Implement transfer from mixin to exchange
  }

  async transferFromExchange(transferDto: any) {
    this.logger.log(`Transferring from exchange to mixin ${transferDto}`);
    // TODO: Implement transfer from exchange to mixin
  }

  // 8. Read pending deposits
  async getPendingDeposits() {
    this.logger.log('Getting pending deposits');
    // TODO: Implement pending deposits retrieval
  }

  // 9. Read auto rebalance parameters
  async getAutoRebalanceParameters() {
    this.logger.log('Getting auto rebalance parameters');
    // TODO: Implement auto rebalance parameters retrieval
  }

  // 10. Read rebalance history
  async getRebalanceHistory(type: string, startDate: string, endDate: string) {
    this.logger.log(
      `Getting rebalance history ${type} ${startDate} ${endDate}`,
    );
    // TODO: Implement rebalance history retrieval
  }
}

// Endpoints to have
// 1. Get all balances
// 2. Get balance by exchange

// 3. Transfer from mixin to exchange
// 4. Transfer from exchange to mixin
// 5. Transfer from exchange to exchange

// 6. Deposit to mixin or exchange by symbol and chain
// 7. Withdraw from mixin or exchange by symbol and chain

// 8. Read pending deposits
// 9. Read auto rebalance parameters
// 10. Read rebalance history

// 11. history type: transfer, deposit, withdraw, auto_rebalance

// 12. Rebalance record: {
//     id: string;
//     asset_id: string;
//     asset_symbol: string;
//     chain_id: string;
//     chain_symbol: string;
//     amount: string;
//     usd_value: string;
//     source: string;
//     destination: string;
//     memo: string;
//     status: string;
//     type: string;
//     fee: string;
//     fee_usd: string;
//     fee_asset_id: string;
//     tx_hash: string
//     created_at: string;
//     updated_at: string;
// }
