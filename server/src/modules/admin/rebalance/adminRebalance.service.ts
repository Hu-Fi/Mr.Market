// Admin Rebalance service
import { Cache } from 'cache-manager';
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

  // 3. Transfer from mixin/exchange to exchange/mixin
  async transfer(
    fromKeyId: string,
    toKeyId: string,
    fromExchange: string,
    toExchange: string,
    symbol: string,
    chain: string,
    amount: string,
  ) {
    this.logger.log(
      `Transferring from ${fromKeyId} ${fromExchange} to ${toKeyId} ${toExchange} ${symbol} ${chain} ${amount}`,
    );
    // TODO: Implement transfer logic
  }

  // Withdraw from mixin or exchange
  async withdraw(
    key_id: string,
    exchange: string,
    symbol: string,
    chain: string,
    amount: string,
    address: string,
    memo: string,
  ) {
    this.logger.log(
      `Withdrawing from ${key_id} ${exchange} ${symbol} ${chain} ${amount} ${address} ${memo}`,
    );
    // TODO: Implement withdrawal logic
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
  async getRebalanceHistory(params: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    this.logger.log('Getting rebalance history');
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
