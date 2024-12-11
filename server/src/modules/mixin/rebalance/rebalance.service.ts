import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getUuid } from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import {
  calculateRebalanceAmount,
  convertAssetBalancesToSymbols,
  getRFC3339Timestamp,
} from 'src/common/helpers/utils';
import BigNumber from 'bignumber.js';
import {
  ASSET_ID_NETWORK_MAP,
  SYMBOL_ASSET_ID_MAP,
} from 'src/common/constants/pairs';
import { RebalanceHistory } from 'src/common/entities/rebalance-asset.entity';

@Injectable()
export class RebalanceService {
  private readonly logger = new CustomLogger(RebalanceService.name);

  constructor(
    private configService: ConfigService,
    private exchangeService: ExchangeService,
    private snapshotService: SnapshotsService,
    private rebalanceRepository: RebalanceRepository,
  ) {}

  @Cron('*/60 * * * * *')
  async rebalance() {
    const enabled = this.configService.get<string>('rebalance.run') === 'true';
    if (enabled === false) {
      return;
    }

    try {
      const mixinBalances = await this.snapshotService.getAllAssetBalances();
      if (!mixinBalances) {
        this.logger.error('Failed to fetch Mixin balances.');
        return;
      }

      const mixinSymbolBalanceMap =
        convertAssetBalancesToSymbols(mixinBalances);
      const allBalanceByKey = await this.exchangeService.getAllAPIKeysBalance();
      if (!allBalanceByKey) {
        this.logger.error('Failed to fetch exchange balances.');
        return;
      }
      const allBalanceByExchange =
        this.exchangeService.aggregateBalancesByExchange(allBalanceByKey);

      // Process each asset for potential rebalance from exchange to mixin
      for (const [symbol, mixinBalance] of Object.entries(
        mixinSymbolBalanceMap,
      )) {
        const minAmount =
          await this.rebalanceRepository.getCurrencyMinAmountBySymbol(
            'mixin',
            symbol,
          );

        const mixinAssetID = SYMBOL_ASSET_ID_MAP[symbol];
        const mixinAmount = BigNumber(mixinBalance);
        if (mixinAmount.lte(minAmount)) {
          this.logger.log(`Rebalance ${symbol} from exchange to Mixin`);
          await this.rebalanceFromExchangeToMixin(
            mixinAssetID,
            symbol,
            mixinAmount,
            BigNumber(minAmount),
            allBalanceByExchange,
          );
        }
      }

      // Check each exchange balance for potential rebalance from mixin to exchange
      for (const [exchange, data] of Object.entries(allBalanceByExchange)) {
        for (const [symbol, balance] of Object.entries(data.total)) {
          const minAmount =
            await this.rebalanceRepository.getCurrencyMinAmountBySymbol(
              exchange,
              symbol,
            );

          if (
            BigNumber(balance).lte(minAmount) &&
            BigNumber(mixinSymbolBalanceMap[symbol] || 0).gt(minAmount)
          ) {
            this.logger.log(`Rebalance ${symbol} from Mixin to exchange`);
            await this.rebalanceFromMixinToExchange(
              symbol,
              balance,
              exchange,
              mixinSymbolBalanceMap[symbol],
            );
          }
        }
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  private async rebalanceFromExchangeToMixin(
    assetId: string,
    symbol: string,
    mixinAmount: BigNumber,
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

      const network = ASSET_ID_NETWORK_MAP[assetId];

      const amountToTransfer = calculateRebalanceAmount(
        totalExchangeBalance,
        mixinAmount,
      ).abs();

      // If amountToTransfer is less than minAmount * 2, skip rebalance;
      if (amountToTransfer.lte(minAmount.multipliedBy(2))) {
        continue;
      }

      for (const apiKeyBalance of apiKeyBalances) {
        const balance = new BigNumber(apiKeyBalance.balances[symbol] || 0);
        if (balance.isEqualTo(0)) continue;

        if (balance.gte(amountToTransfer)) {
          await this.exchangeService.createWithdrawal({
            exchange,
            apiKeyId: apiKeyBalance.api_key_id,
            symbol,
            network,
            address: mixinDeposit.address,
            tag: mixinDeposit.memo,
            amount: amountToTransfer.toString(),
          });
          await this.addRebalanceHistory({
            trace_id: getUuid(),
            from: exchange,
            to: 'mixin',
            api_key_id: apiKeyBalance.api_key_id,
            symbol: symbol,
            asset_id: assetId,
            amount: amountToTransfer.toString(),
            dest_address: mixinDeposit.address,
            memo: mixinDeposit.memo,
            timestamp: getRFC3339Timestamp(),
          });
        } else {
          // In this case the api key doesn't have enough fund for amount to rebalance
          // we can gather funds into one api key
          // or we choose an API key with the most funds to withdraw
        }
      }
    }
  }

  private async rebalanceFromMixinToExchange(
    symbol: string,
    balance: BigNumber.Value,
    exchange: string,
    mixinBalance: BigNumber.Value,
  ) {
    const balanceBN = new BigNumber(balance);
    const mixinBalanceBN = new BigNumber(mixinBalance);

    // Log the initiation of the rebalance process
    this.logger.log(
      `Starting rebalance from Mixin to ${exchange} for ${symbol} with balance ${balanceBN.toString()}`,
    );

    // Retrieve the minimum balance requirement for the asset on the exchange
    const minimum_balance =
      await this.rebalanceRepository.getCurrencyMinAmountBySymbol(
        exchange,
        symbol,
      );
    const minBalance = new BigNumber(minimum_balance);

    // Determine if rebalance is necessary
    if (!balanceBN.isLessThanOrEqualTo(minBalance)) {
      return;
    }
    // Calculate the amount needed to rebalance
    const amountToRebalance = calculateRebalanceAmount(
      balanceBN,
      mixinBalanceBN,
    ).abs();
    if (amountToRebalance.isLessThanOrEqualTo(0)) {
      this.logger.warn(
        `Calculated amount to rebalance is not positive. Calculated: ${amountToRebalance.toString()}`,
      );
      return;
    }

    // Select an API key for the exchange
    const apiKey = await this.exchangeService.findFirstAPIKeyByExchange(
      exchange,
    );

    if (!apiKey) {
      this.logger.error(
        `exchangeService.findFirstAPIKeyByExchange(${exchange}) => no api key found`,
      );
      return;
    }

    const assetID = SYMBOL_ASSET_ID_MAP[symbol];
    // Get network by asset id
    const network = ASSET_ID_NETWORK_MAP[assetID];

    const depositAddress = await this.exchangeService.getDepositAddress({
      exchange,
      apiKeyId: apiKey.key_id,
      symbol,
      network,
    });
    if (!depositAddress) {
      this.logger.error(
        `Failed to get deposit address for ${symbol} on ${exchange}`,
      );
      return;
    }

    // Initiate the transfer from Mixin to the exchange
    const transferResult = await this.snapshotService.withdrawal(
      assetID,
      depositAddress.address,
      depositAddress.memo,
      amountToRebalance.toString(),
    );

    await this.addRebalanceHistory({
      trace_id: getUuid(),
      from: exchange,
      to: 'mixin',
      api_key_id: apiKey.key_id,
      symbol: symbol,
      asset_id: assetID,
      amount: amountToRebalance.toString(),
      dest_address: depositAddress.address,
      memo: depositAddress.memo,
      timestamp: getRFC3339Timestamp(),
    });

    if (Array.isArray(transferResult) && transferResult.length > 0) {
      this.logger.log(
        `Successfully initiated transfer of ${amountToRebalance.toString()} ${symbol} from Mixin to ${exchange}`,
      );
    } else {
      this.logger.error(
        `Failed to initiate transfer from mixin to ${exchange}.`,
      );
    }
  }

  async findAllTokensWithExchangesAndBalances(): Promise<any[]> {
    return this.rebalanceRepository.findAllTokensWithExchangesAndBalances();
  }

  async findAllExchagnes(): Promise<any[]> {
    return this.rebalanceRepository.findAllExchagnes();
  }

  async addRebalanceHistory(history: RebalanceHistory) {
    return this.rebalanceRepository.addRebalanceHistory(history);
  }

  async getCurrencyMinAmountBySymbol(
    exchangeName: string,
    symbol: string,
  ): Promise<string | null> {
    return this.rebalanceRepository.getCurrencyMinAmountBySymbol(
      exchangeName,
      symbol,
    );
  }

  async addMinimumBalance(
    symbol: string,
    assetId: string,
    exchangeName: string,
    minimumBalance: string,
  ): Promise<void> {
    return this.rebalanceRepository.addMinimumBalance(
      symbol,
      assetId,
      exchangeName,
      minimumBalance,
    );
  }

  async updateMinimumBalance(
    assetId: string,
    exchangeName: string,
    minimumBalance: string,
  ): Promise<void> {
    return this.rebalanceRepository.updateMinimumBalance(
      assetId,
      exchangeName,
      minimumBalance,
    );
  }
}
