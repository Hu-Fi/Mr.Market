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
  async getTransferInfo(
    fromKeyId: string,
    toKeyId: string,
    symbol: string,
    chain: string,
  ) {
    const fromExchangeKey = await this.exchangeService.readAPIKey(fromKeyId);
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromExchangeKey.api_key,
      fromExchangeKey.api_secret,
      fromExchangeKey.api_extra,
      fromExchangeKey.exchange,
      symbol,
    );

    const toExchangeKey = await this.exchangeService.readAPIKey(toKeyId);
    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toExchangeKey.api_key,
      toExchangeKey.api_secret,
      toExchangeKey.api_extra,
      toExchangeKey.exchange,
      symbol,
    );

    return {
      fromMinWithdrawalAmount:
        fromExchangeCurrencyInfo.networks[chain].limits.withdraw.min,
      fromWithdrawalFee: fromExchangeCurrencyInfo.networks[chain].fee,
      toMinDepositAmount:
        toExchangeCurrencyInfo.networks[chain].limits.deposit.min,
      toDepositAddress: await this.exchangeService.getDepositAddress({
        apiKeyId: toKeyId,
        symbol,
        network: chain,
      }),
      toDepositMemo: toExchangeCurrencyInfo.networks[chain].memo || null,
      toDepositConfirmations:
        toExchangeCurrencyInfo.networks[chain].confirmations,
    };
  }

  async transferBetweenExchanges(
    fromKeyId: string,
    toKeyId: string,
    symbol: string,
    chain: string,
    amount: string,
    memo: string,
  ) {
    this.logger.log(
      `Transferring from ${fromKeyId} to ${toKeyId} ${symbol} ${chain} ${amount}`,
    );

    const fromExchangeKey = await this.exchangeService.readAPIKey(fromKeyId);
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromExchangeKey.api_key,
      fromExchangeKey.api_secret,
      fromExchangeKey.api_extra,
      fromExchangeKey.exchange,
      symbol,
    );

    const toExchangeKey = await this.exchangeService.readAPIKey(toKeyId);
    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toExchangeKey.api_key,
      toExchangeKey.api_secret,
      toExchangeKey.api_extra,
      toExchangeKey.exchange,
      symbol,
    );

    if (!fromExchangeCurrencyInfo.networks[chain]) {
      throw new Error(`Chain ${chain} not supported by fromExchange`);
    }
    if (!toExchangeCurrencyInfo.networks[chain]) {
      throw new Error(`Chain ${chain} not supported by toExchange`);
    }

    const fromExchangeMinWithdrawalAmount =
      fromExchangeCurrencyInfo.networks[chain].limits.withdraw.min;
    const fromExchangeWithdrawalFee =
      fromExchangeCurrencyInfo.networks[chain].fee;
    const fromExchangeWithdrawalEnabled =
      fromExchangeCurrencyInfo.networks[chain].withdraw;
    if (new BigNumber(amount).isLessThan(fromExchangeMinWithdrawalAmount)) {
      throw new Error(`Amount is less than the minimum withdrawal amount`);
    }

    const toExchangeMinDepositAmount =
      toExchangeCurrencyInfo.networks[chain].limits.deposit.min;

    if (
      new BigNumber(amount)
        .minus(fromExchangeWithdrawalFee)
        .isLessThan(toExchangeMinDepositAmount)
    ) {
      throw new Error(
        `Amount after fee is less than the minimum deposit amount`,
      );
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

    if (toExchangeDepositAddress.memo && !memo) {
      throw new Error(`Memo is required for this transaction`);
    }

    if (!fromExchangeWithdrawalEnabled) {
      throw new Error(`Withdrawal is not enabled for fromExchange`);
    }

    try {
      await this.exchangeService.createWithdrawal({
        apiKeyId: fromKeyId,
        symbol,
        network: chain,
        exchange: fromExchangeKey.exchange,
        address: toExchangeDepositAddress.address,
        amount,
        tag: memo,
      });
      this.logger.log(`Transfer successful from ${fromKeyId} to ${toKeyId}`);
    } catch (error) {
      this.logger.error(`Transfer failed: ${error.message}`);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async transferFromMixinToExchange(
    assetId: string,
    amount: string,
    toKeyId: string,
  ) {
    this.logger.log(
      `Transferring from mixin to exchange with assetId: ${assetId}, amount: ${amount}, toKeyId: ${toKeyId}`,
    );

    // Check amount > balance in mixin
    const mixinBalance = await this.snapshotService.getAssetBalance(assetId);
    if (new BigNumber(mixinBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in mixin`);
    }

    // Get symbol and chainId
    const asset = await this.snapshotService.getAsset(assetId);
    const symbol = asset.symbol;
    const chainId = asset.chain_id;

    if (new BigNumber(mixinBalance).isLessThan(withdrawalFee)) {
      throw new Error(`Insufficient balance to cover withdrawal fee`);
    }

    const toExchangeDepositAddress =
      await this.exchangeService.getDepositAddress({
        apiKeyId: toKeyId,
        symbol,
        network: chainId,
      });

    if (!toExchangeDepositAddress) {
      throw new Error(`Deposit address not found for toExchange`);
    }

    const withdrawalFee = await this.snapshotService.getWithdrawalFee(
      assetId,
      toExchangeDepositAddress.address,
    );
    if (toExchangeDepositAddress.memo) {
      // Handle memo logic if required
    }

    try {
      await this.snapshotService.withdrawal(
        assetId,
        toExchangeDepositAddress.address,
        toExchangeDepositAddress.memo || '',
        amount,
      );
      this.logger.log(`Transfer from mixin to exchange successful`);
    } catch (error) {
      this.logger.error(`Transfer failed: ${error.message}`);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  // Transfer from exchange to mixin
  async transferFromExchangeToMixin(
    fromKeyId: string,
    symbol: string,
    network: string,
    amount: string,
  ) {
    this.logger.log(
      `Transferring from exchange to mixin with fromKeyId: ${fromKeyId}, symbol: ${symbol}, network: ${network}, amount: ${amount}`,
    );

    const mixinDepositFee = await this.snapshotService.getDepositFee(
      symbol,
      network,
    );
    const assetId = await this.snapshotService.mapSymbolAndNetworkToAssetId(
      symbol,
      network,
    );

    const fromExchangeBalance = await this.exchangeService.getBalanceByKeyLabel(
      fromKeyId,
    );
    if (new BigNumber(fromExchangeBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in fromExchange`);
    }

    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromKeyId,
      symbol,
      network,
    );

    const fromExchangeWithdrawalFee =
      fromExchangeCurrencyInfo.networks[network].fee;
    const fromExchangeMinWithdrawalAmount =
      fromExchangeCurrencyInfo.networks[network].limits.withdraw.min;

    if (
      new BigNumber(fromExchangeBalance).isLessThan(fromExchangeWithdrawalFee)
    ) {
      throw new Error(`Insufficient balance to cover withdrawal fee`);
    }

    if (new BigNumber(amount).isLessThan(fromExchangeMinWithdrawalAmount)) {
      throw new Error(`Amount is less than the minimum withdrawal amount`);
    }

    const mixinDepositAddress = await this.snapshotService.getDepositAddress(
      assetId,
    );

    if (!mixinDepositAddress) {
      throw new Error(`Deposit address not found for mixin`);
    }

    if (mixinDepositAddress.memo && !memo) {
      throw new Error(`Memo is required for this transaction`);
    }

    try {
      await this.exchangeService.createWithdrawal({
        apiKeyId: fromKeyId,
        symbol,
        network,
        exchange: fromExchangeCurrencyInfo.exchange,
        address: mixinDepositAddress.address,
        amount,
        tag: memo,
      });
      this.logger.log(`Transfer from exchange to mixin successful`);
    } catch (error) {
      this.logger.error(`Transfer failed: ${error.message}`);
      throw new Error(`Transfer failed: ${error.message}`);
    }
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
