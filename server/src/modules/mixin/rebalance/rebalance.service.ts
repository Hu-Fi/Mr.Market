import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// import BigNumber from 'bignumber.js';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import { convertAssetBalancesToSymbols } from 'src/common/helpers/utils';
import BigNumber from 'bignumber.js';
import { AggregatedBalances } from 'src/common/types/rebalance/map';
import { SYMBOL_ASSET_ID_MAP } from 'src/common/constants/pairs';

@Injectable()
export class RebalanceService {
  private readonly logger = new Logger(RebalanceService.name);
  private rebalancePairs;

  constructor(
    private exchangeService: ExchangeService,
    private snapshotService: SnapshotsService,
    private customConfigService: CustomConfigService,
    private rebalanceRepository: RebalanceRepository,
  ) {}

  // We build a table which we can set the minium rebalance value for every asset in every exchange
  //
  // For example:
  // for btc in okx, we can set 0.5 as the minium balance that triggers rebalance
  // once this rebalance worker found btc in okx is smaller than 0.5, it initate checks
  // if the checks are passed, rebalance from mixin to okx
  //
  // We get the balance of every asset in mixin first, and get the total balance from all api keys
  // Create a map so we can access the balance via the symbol of asset (like BTC)
  //
  // The rebalance from mixin to exchange api keys is straight forward.
  // When mixin has more money than needed, we compare and calulate a balance amount (substract from mixin but still remain balanced)
  // We pick a random api key in that exchange, get the deposit address and inital withdrawal in mixin to that address.
  //
  // The rebalance from exchagne api keys to mixin is a bit complex.
  // When exchange api keys have more money than needed, we compare and calulate a balance amount (substract from exchange but still remain balanced)
  // We need to compare and check if the key with the most balance is enough for the withdrawal
  // If not enough, we need to gather funds in different api keys into one, and triggers withdrawal
  // If enough, choose the one with the most funds and withdraw

  // Basically
  // If mixin balance is greater than minium amount, we don't rebalance.
  // If mixin balance is smaller or equal minium amount, we rebalance from exchange api key to mixin. (this is complicated because we need to pick a api key that have enough balance. and we have multiple api keys so if one api key doesn't have enough balance we need to gather the balance to one api key and withdraw to mixin)
  // if exchange is greater than minium amount, we don't rebalance.
  // if exchange is smaller or equal to minium amount, we rebalance from mixin to exchange api key.(this is easy because we just pick any api key in that exchange)

  @Cron('*/15 * * * *')
  async rebalance() {
    const mixinBalances = await this.snapshotService.getAllAssetBalances();
    if (!mixinBalances) {
      this.logger.error('Failed to fetch Mixin balances.');
      return;
    }

    const mixinSymbolBalanceMap = convertAssetBalancesToSymbols(mixinBalances);
    const allBalanceByKey = await this.exchangeService.getAllAPIKeysBalance();
    if (!allBalanceByKey) {
      this.logger.error('Failed to fetch exchange balances.');
      return;
    }
    const allBalanceByExchange =
      this.exchangeService.aggregateBalancesByExchange(allBalanceByKey);

    // Process each asset for potential rebalance
    for (const [symbol, mixinBalance] of Object.entries(
      mixinSymbolBalanceMap,
    )) {
      const minAmount =
        await this.rebalanceRepository.getCurrencyMinAmountBySymbol(
          'mixin',
          symbol,
        );

      if (BigNumber(mixinBalance).lte(minAmount.minium_balance)) {
        // Rebalance from exchange to Mixin
        await this.rebalanceFromExchangeToMixin(
          symbol,
          minAmount.minium_balance,
          allBalanceByExchange,
        );
      } else {
        this.logger.log(
          `Mixin balance for ${symbol} is above the minimum threshold. No rebalance needed.`,
        );
      }
    }

    // Check each exchange balance for potential rebalance to Mixin
    for (const [exchange, data] of Object.entries(allBalanceByExchange)) {
      for (const [symbol, balance] of Object.entries(data.total)) {
        const minAmount =
          await this.rebalanceRepository.getCurrencyMinAmountBySymbol(
            exchange,
            symbol,
          );

        if (
          BigNumber(balance).lte(minAmount.minium_balance) &&
          BigNumber(mixinSymbolBalanceMap[symbol] || 0).gt(
            minAmount.minium_balance,
          )
        ) {
          // Rebalance from Mixin to exchange
          await this.rebalanceFromMixinToExchange(symbol, balance, exchange);
        } else {
          this.logger.log(
            `Exchange balance for ${symbol} in ${exchange} is above the minimum threshold. No rebalance needed.`,
          );
        }
      }
    }
  }

  private async rebalanceFromExchangeToMixin(
    symbol: string,
    minAmount: BigNumber,
    allBalanceByExchange: any,
  ) {
    const requiredAmount = new BigNumber(minAmount);
    // Iterate through each exchange to find and consolidate balances for the symbol
    for (const exchange of Object.keys(allBalanceByExchange)) {
      const { apiKeyBalances } = allBalanceByExchange[exchange];
      let totalExchangeBalance = new BigNumber(0);

      // Calculate total balance across all API keys for the exchange
      apiKeyBalances.forEach((apiKeyBalance: any) => {
        if (apiKeyBalance.balances[symbol]) {
          totalExchangeBalance = totalExchangeBalance.plus(
            apiKeyBalance.balances[symbol],
          );
        }
      });

      // If total balance in exchange is less than or equal to the minimum, skip the exchange
      if (totalExchangeBalance.lte(requiredAmount)) continue;

      // Get mixin deposit address
      const mixinDeposit = await this.snapshotService.depositAddress(
        SYMBOL_ASSET_ID_MAP[symbol],
      );

      // TODO !!! Get network from asset id. use a map that maps asset id to network name
      const network = 'TODO FIX !!! network';

      // TODO !!! amountToTransfer need to be calculated with an algorithm
      const amountToTransfer = new BigNumber('TODO FIX !!! amount');

      for (const apiKeyBalance of apiKeyBalances) {
        const balance = new BigNumber(apiKeyBalance.balances[symbol] || 0);
        if (balance.isEqualTo(0)) continue; // Skip if no balance

        if (balance.gte(amountToTransfer)) {
          // This API key alone can fulfill the requirement
          await this.exchangeService.createWithdrawal({
            exchange,
            apiKeyId: apiKeyBalance.api_key_id,
            symbol,
            network,
            address: mixinDeposit.address,
            tag: mixinDeposit.memo,
            amount: amountToTransfer.toString(),
          });
          break;
        } else {
          // Partially fulfill from this API key and continue accumulating
          // Gath funds into one api key
        }
      }
    }
  }

  private async rebalanceFromMixinToExchange(
    symbol: string,
    balance: BigNumber.Value,
    exchange: string,
  ) {
    // TODO: Implement
  }

  hasSymbolWithSufficientTotalBalance(
    aggregatedBalances: AggregatedBalances,
    symbol: string,
    minimumAmount: number,
  ): boolean {
    for (const exchange of Object.values(aggregatedBalances)) {
      const totalBalances = exchange.total;
      const balanceForSymbol = totalBalances[symbol];
      if (balanceForSymbol !== undefined) {
        const balanceAmount = parseFloat(balanceForSymbol);
        if (!isNaN(balanceAmount) && balanceAmount >= minimumAmount) {
          return true;
        }
      }
    }
    return false;
  }

  // Read rebalance gap from custom config
  // const gap = await this.customConfigService.readRebalanceGap();
  //
  // Get white listed pairs
  // Check if the differences between the balance of the api key and mixin reachs the gap
}
