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

  async getBalanceByKey(keyId: string) {
    this.logger.debug(`Getting balance for key label: ${keyId}`);
    return await this.exchangeService.getBalanceByKey(keyId);
  }

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
    if (!fromKeyId || !toKeyId || !symbol || !chain) {
      throw new Error('Invalid parameters');
    }
    if (fromKeyId === toKeyId) {
      throw new Error('Must transfer between different exchanges');
    }
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromKeyId,
      symbol,
    );

    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toKeyId,
      symbol,
    );

    const fromChain = fromExchangeCurrencyInfo.networks[chain];
    const toChain = toExchangeCurrencyInfo.networks[chain];
    const toDepositAddress = await this.exchangeService.getDepositAddress({
      apiKeyId: toKeyId,
      symbol,
      network: chain,
    });

    return {
      from_min_withdrawal_amount: fromChain.limits.withdraw.min,
      from_withdrawal_fee: fromChain.fee,
      to_min_deposit_amount: toChain.limits.deposit.min,
      to_deposit_address: toDepositAddress.address,
      to_deposit_memo: toDepositAddress.memo || '',
      to_deposit_confirmations: toChain.confirmations,
    };
  }

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
    // 1. Check all parameters
    if (!fromKeyId || !toKeyId || !symbol || !chain || !amount) {
      throw new Error('Invalid parameters');
    }
    if (fromKeyId === toKeyId) {
      throw new Error('Must transfer between different exchanges');
    }
    if (new BigNumber(amount).isLessThanOrEqualTo(0)) {
      throw new Error('Amount must be greater than 0');
    }

    // 2. Get exchange with id
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromKeyId,
      symbol,
    );
    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toKeyId,
      symbol,
    );

    const fromCurrency = fromExchangeCurrencyInfo;
    const toCurrency = toExchangeCurrencyInfo;

    const fromChain = fromCurrency.networks[chain];
    const toChain = toCurrency.networks[chain];
    if (!fromChain) {
      throw new Error(`Chain ${chain} not supported by fromExchange`);
    }
    if (!toChain) {
      throw new Error(`Chain ${chain} not supported by toExchange`);
    }

    // 3. Check if withdrawal is enabled
    const fromExchangeWithdrawalEnabled = fromCurrency.networks[chain].withdraw;
    if (!fromExchangeWithdrawalEnabled) {
      throw new Error(`Withdrawal is not enabled for fromExchange`);
    }

    // 4. Check amount > balance in from_exchange
    const fromExchangeBalance = await this.exchangeService.getBalanceByKey(
      fromKeyId,
    );
    if (new BigNumber(fromExchangeBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in fromExchange`);
    }

    // 5. Check balance > withdrawal fee
    const fromExchangeWithdrawalFee = fromCurrency.networks[chain].fee;
    if (new BigNumber(amount).isLessThan(fromExchangeWithdrawalFee)) {
      throw new Error(`Insufficient balance to cover withdrawal fee`);
    }

    // 6. Check balance > min withdraw amount
    const fromExchangeMinWithdrawalAmount = fromChain.limits.withdraw.min;
    if (new BigNumber(amount).isLessThan(fromExchangeMinWithdrawalAmount)) {
      throw new Error(`Amount is less than the minimum withdrawal amount`);
    }

    // 7. Check amount - fee > min deposit
    const toExchangeMinDepositAmount =
      toCurrency.networks[chain].limits.deposit.min;
    if (
      new BigNumber(amount)
        .minus(fromExchangeWithdrawalFee)
        .isLessThan(toExchangeMinDepositAmount)
    ) {
      throw new Error(
        `Amount after fee is less than the minimum deposit amount`,
      );
    }

    // 8. Get deposit address
    const toExchangeDepositAddress =
      await this.exchangeService.getDepositAddress({
        apiKeyId: toKeyId,
        symbol,
        network: chain,
      });

    // 9. Check address not null
    if (!toExchangeDepositAddress) {
      throw new Error(`Deposit address not found for toExchange`);
    }

    // 10. Check if memo required
    const memo = toExchangeDepositAddress.memo || '';

    // 11. Initiate withdrawal
    try {
      await this.exchangeService.createWithdrawal({
        apiKeyId: fromKeyId,
        symbol,
        network: chain,
        exchange: fromCurrency.exchange.id,
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

    // 1. Validate parameters
    if (!assetId || !amount || !toKeyId) {
      throw new Error(`Invalid parameters`);
    }
    if (new BigNumber(amount).isLessThanOrEqualTo(0)) {
      throw new Error(`Amount must be greater than 0`);
    }

    // 2. Check amount > balance in mixin
    const mixinBalance = await this.snapshotService.getAssetBalance(assetId);
    if (new BigNumber(mixinBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in mixin`);
    }

    // 3. Get withdrawal fee, symbol, chain id
    const asset = await this.snapshotService.getAsset(assetId);
    const symbol = asset.symbol;
    const chainId = asset.chain_id;

    // 4. Get chain asset, get chain symbol
    const chainAsset = await this.snapshotService.getAsset(chainId);
    const chainSymbol = chainAsset.symbol;

    // 5. Get deposit address
    const toExchangeDepositAddress =
      await this.exchangeService.getDepositAddress({
        apiKeyId: toKeyId,
        symbol,
        network: chainSymbol,
      });

    // 6. Check address not null
    if (!toExchangeDepositAddress) {
      throw new Error(`Deposit address not found for toExchange`);
    }

    // 7. Check balance > withdrawal fee
    const withdrawalFee = await this.snapshotService.getWithdrawalFee(
      assetId,
      toExchangeDepositAddress.address,
    )[0];
    if (new BigNumber(mixinBalance).isLessThan(withdrawalFee)) {
      throw new Error(`Insufficient balance to cover withdrawal fee`);
    }

    // 8. Get min deposit amount
    const toExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      toKeyId,
      symbol,
    );
    const toExchangeMinDepositAmount =
      toExchangeCurrencyInfo.networks[chainId].limits.deposit.min;

    // 9. Check amount - fee > min deposit
    if (
      new BigNumber(amount)
        .minus(withdrawalFee)
        .isLessThan(toExchangeMinDepositAmount)
    ) {
      throw new Error(
        `Amount after fee is less than the minimum deposit amount`,
      );
    }

    // 10. Check if memo required
    const memo = toExchangeDepositAddress.memo || '';

    // 11. Initiate withdrawal
    try {
      await this.snapshotService.withdrawal(
        assetId,
        toExchangeDepositAddress.address,
        memo,
        amount,
      );
      this.logger.log(`Transfer from mixin to exchange successful`);
    } catch (error) {
      this.logger.error(`Transfer failed: ${error.message}`);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async transferFromExchangeToMixin(
    fromKeyId: string,
    symbol: string,
    network: string,
    amount: string,
  ) {
    this.logger.log(
      `Transferring from exchange to mixin with fromKeyId: ${fromKeyId}, symbol: ${symbol}, network: ${network}, amount: ${amount}`,
    );

    // 0. Get mixin deposit fee
    // const mixinDepositFee = await this.snapshotService.getDepositFee(
    //   symbol,
    //   network,
    // );

    // 1. Validate parameters
    if (!fromKeyId || !symbol || !network || !amount) {
      throw new Error(`Invalid parameters`);
    }
    if (new BigNumber(amount).isLessThanOrEqualTo(0)) {
      throw new Error(`Amount must be greater than 0`);
    }

    // 2. Map symbol and network to asset id
    const assetId = await this.snapshotService.mapSymbolAndNetworkToAssetId(
      symbol,
      network,
    );

    // 3. Check amount > balance in from_exchange
    const fromExchangeBalance = await this.exchangeService.getBalanceByKey(
      fromKeyId,
    );
    if (new BigNumber(fromExchangeBalance).isLessThan(amount)) {
      throw new Error(`Insufficient balance in fromExchange`);
    }

    // 4. Get withdrawal fee
    const fromExchangeCurrencyInfo = await this.exchangeService.getCurrencyInfo(
      fromKeyId,
      symbol,
    );
    const fromExchangeWithdrawalFee =
      fromExchangeCurrencyInfo.networks[network].fee;

    // 5. Check balance > withdrawal fee
    if (
      new BigNumber(fromExchangeBalance).isLessThan(fromExchangeWithdrawalFee)
    ) {
      throw new Error(`Insufficient balance to cover withdrawal fee`);
    }

    // // 6. Get deposit fee usd
    // const depositFeeUsd = mixinDepositFee.usd; // Assuming mixinDepositFee has a usd property

    // // 7. Check amount usd > fee usd
    // const amountUsd = new BigNumber(amount).multipliedBy(fromExchangeCurrencyInfo.priceUsd); // Assuming priceUsd is available
    // if (amountUsd.isLessThan(depositFeeUsd)) {
    //   throw new Error(`Amount in USD is less than the deposit fee in USD`);
    // }

    // 8. Get min withdrawal amount
    const fromExchangeMinWithdrawalAmount =
      fromExchangeCurrencyInfo.networks[network].limits.withdraw.min;

    // 9. Check balance > min withdraw amount
    if (new BigNumber(amount).isLessThan(fromExchangeMinWithdrawalAmount)) {
      throw new Error(`Amount is less than the minimum withdrawal amount`);
    }

    // 10. Get deposit address
    const mixinDepositAddress = await this.snapshotService.getDepositAddress(
      assetId,
    );

    // 11. Check address not null
    if (!mixinDepositAddress) {
      throw new Error(`Deposit address not found for mixin`);
    }

    // 12. Check if memo required
    const memo = mixinDepositAddress.memo || '';

    // 13. Initiate withdrawal
    try {
      await this.exchangeService.createWithdrawal({
        apiKeyId: fromKeyId,
        symbol,
        network,
        exchange: fromExchangeCurrencyInfo.exchange.id,
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
  async getAllRebalanceHistory() {
    this.logger.log(`Getting all rebalance history`);
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
