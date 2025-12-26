import BigNumber from 'bignumber.js';
import { Injectable } from '@nestjs/common';
import { KeystoreClientReturnType, SafeWithdrawalFee } from '@mixin.dev/mixin-node-sdk';
import { ExchangeInitService } from '../../infrastructure/exchange-init/exchange-init.service';
import { CustomLogger } from '../../infrastructure/logger/logger.service';
import { MixinClientService } from '../../mixin/client/mixin-client.service';
import { MIXIN_DEPOSIT_FEES } from 'src/common/constants/constants';
import { CustomConfigService } from '../../infrastructure/custom-config/custom-config.service';
import { GrowdataRepository } from 'src/modules/data/grow-data/grow-data.repository';

interface WithdrawalFeeWithPriority extends SafeWithdrawalFee {
  priority: number;
}

@Injectable()
export class FeeService {
  private readonly logger = new CustomLogger(FeeService.name);
  private client: KeystoreClientReturnType;

  constructor(
    private readonly exchangeInitService: ExchangeInitService,
    private readonly mixinClientService: MixinClientService,
    private readonly customConfigService: CustomConfigService,
    private readonly growDataRepository: GrowdataRepository,
  ) {
    this.client = this.mixinClientService.client;
  }

  async getFeeInfo() {
    return {
      // Admin fee controller
    };
  }

  async calculateMoveFundsFee(
    exchangeName: string,
    pair: string,
    direction: 'deposit_to_exchange' | 'withdraw_to_mixin' | 'withdraw_external',
  ) {
    const [base_symbol, quote_symbol] = pair.split('/');
    let base_fee, quote_fee, direction_info;
    let mixin_deposit_fee = '0';

    // Fetch the trading pair configuration from database to get the correct asset IDs
    const tradingPairConfig = await this.growDataRepository.findMarketMakingPairByExchangeAndSymbol(
      exchangeName,
      pair,
    );

    if (!tradingPairConfig) {
      this.logger.error(`Trading pair configuration not found for ${exchangeName} ${pair}`);
      throw new Error(`Trading pair configuration not found for ${exchangeName} ${pair}`);
    }

    // Use the configured asset IDs from the database
    const base = tradingPairConfig.base_asset_id;
    const quote = tradingPairConfig.quote_asset_id;

    const base_asset = await this.client.safe.fetchAsset(base);
    const quote_asset = await this.client.safe.fetchAsset(quote);

    if (direction === 'deposit_to_exchange') {
      direction_info = 'mixin->exchange'
    } else if (direction === 'withdraw_to_mixin') {
      direction_info = 'exchange->mixin'
    } else if (direction === 'withdraw_external') {
      direction_info = 'exchange->external'
    } else {
      return;
    }

    try {
      if (direction === 'deposit_to_exchange') {
        base_fee = await this.getMixinWithdrawalFee(base);
        quote_fee = await this.getMixinWithdrawalFee(quote);
        const base_fee_asset = await this.client.safe.fetchAsset(base_fee?.asset_id);
        const quote_fee_asset = await this.client.safe.fetchAsset(quote_fee?.asset_id);

        // Get market making fee percentage from custom config
        const market_making_fee_percentage = await this.customConfigService.readMarketMakingFee();

        return {
          base_asset_id: base_asset.asset_id,
          quote_asset_id: quote_asset.asset_id,
          base_fee_id: base_fee?.asset_id,
          quote_fee_id: quote_fee?.asset_id,
          base_fee_amount: base_fee?.amount,
          quote_fee_amount: quote_fee?.amount,
          base_fee_symbol: base_fee_asset.symbol,
          quote_fee_symbol: quote_fee_asset.symbol,
          base_fee_price_usd: base_fee_asset.price_usd,
          quote_fee_price_usd: quote_fee_asset.price_usd,
          base_asset_price_usd: base_asset.price_usd,
          quote_asset_price_usd: quote_asset.price_usd,
          market_making_fee_percentage,
          direction: direction_info,
        };
      } else if (direction === 'withdraw_to_mixin') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          base_fee = exchangeFees.baseFee;
          quote_fee = exchangeFees.quoteFee;
        }

        // Deposit fee in USD
        const base_mixin_fee = this.getMixinDepositFee(base_asset.chain_id);
        const quote_mixin_fee = this.getMixinDepositFee(quote_asset.chain_id);
        mixin_deposit_fee = BigNumber(base_mixin_fee).plus(quote_mixin_fee).toString();

        return {
          symbol: pair,
          base_asset_id: base_asset.asset_id,
          quote_asset_id: quote_asset.asset_id,
          base_asset_fee: base_fee?.amount,
          quote_asset_fee: quote_fee?.amount,
          mixin_deposit_fee,
          direction: direction_info,
        };
      } else if (direction === 'withdraw_external') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          base_fee = exchangeFees.baseFee;
          quote_fee = exchangeFees.quoteFee;
        }
        return {
          symbol: pair,
          base_asset_id: base_asset.asset_id,
          quote_asset_id: quote_asset.asset_id,
          base_asset_fee: base_fee?.amount,
          quote_asset_fee: quote_fee?.amount,
          direction: direction_info,
        }
      }
    } catch (error) {
      this.logger.error(`Error fetching fees: ${error.message}`);
    }

    return {
      symbol: pair,
      base_asset_id: base_asset.asset_id,
      quote_asset_id: quote_asset.asset_id,
      direction: direction_info,
    };
  }

  private async getMixinWithdrawalFee(asset_id: string): Promise<WithdrawalFeeWithPriority> {
    try {
      const asset_detail = await this.client.safe.fetchAsset(asset_id);
      if (asset_detail) {
        // @ts-expect-error fetchFee is not in type definition but exists in SDK as per user
        const fees: WithdrawalFeeWithPriority[] = await this.client.safe.fetchFee(asset_detail.asset_id);

        // Find the fee with maximum priority
        if (fees && fees.length > 0) {
          const maxPriorityFee = fees.reduce((max, current) => {
            return current.priority > max.priority ? current : max;
          });
          return maxPriorityFee;
        }
      }
    } catch (e) {
      this.logger.error(`Failed to get Mixin withdrawal fee for ${asset_id}: ${e.message}`);
    }
  }

  private async getExchangeWithdrawalFee(exchange: any, base: string, quote: string) {
    let baseFee = 0;
    let quoteFee = 0;

    // Try to fetch transaction fees
    if (exchange.has['fetchTransactionFees']) {
      try {
        const fees = await exchange.fetchTransactionFees([base, quote]);
        if (fees) {
          if (fees[base]) baseFee = fees[base].withdraw || 0;
          if (fees[quote]) quoteFee = fees[quote].withdraw || 0;
        }
      } catch (e) {
        this.logger.error(`fetchTransactionFees failed: ${e.message}`);
      }
    }

    // Fallback if fetchTransactionFees didn't work or returned nothing, try currencies
    if (baseFee === 0 && quoteFee === 0 && exchange.currencies) {
      if (exchange.currencies[base]) baseFee = exchange.currencies[base].fee || 0;
      if (exchange.currencies[quote]) quoteFee = exchange.currencies[quote].fee || 0;
    }

    return { baseFee, quoteFee };
  }

  private getMixinDepositFee(chain_id: string): number {
    return MIXIN_DEPOSIT_FEES[chain_id] || 0;
  }
}
