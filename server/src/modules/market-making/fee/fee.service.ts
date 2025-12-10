import { Injectable } from '@nestjs/common';
import { KeystoreClientReturnType, SafeWithdrawalFee } from '@mixin.dev/mixin-node-sdk';
import { ExchangeInitService } from '../../infrastructure/exchange-init/exchange-init.service';
import { CustomLogger } from '../../infrastructure/logger/logger.service';
import BigNumber from 'bignumber.js';
import { MixinClientService } from '../../mixin/client/mixin-client.service';

@Injectable()
export class FeeService {
  private readonly logger = new CustomLogger(FeeService.name);
  private client: KeystoreClientReturnType;

  private readonly MIXIN_DEPOSIT_FEES = {
    // USD 3
    '43d61dcd-e413-450d-80b8-101d5e903357': 3, // Ethereum
    'c6d0c728-2624-429b-8e0d-d9d19b6592fa': 3, // Bitcoin

    // USD 0.1
    'b7938396-3f94-4e0a-9179-d3440718156f': 0.1, // Polygon (PoS)
    '1949e683-6a08-49e2-b087-d6b72398588f': 0.1, // BSC
    '3fb612c5-6844-3979-ae4a-5a84e79da870': 0.1, // Base
    '76c802a2-7c88-447f-a93e-c29c9e5dd9c8': 0.1, // Litecoin
    '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': 0.1, // Dogecoin
    'c996abc9-d94e-4494-b1cf-2a3fd3ac5714': 0.1, // Zcash
    '64692c23-8971-4cf4-84a7-4dd1271dd887': 0.1, // Solana
    '05c5ac01-31f9-4a69-aa8a-ab796de1d041': 0.1, // Monero
    '25dabac5-056a-48ff-b9f9-f67395dc407c': 0.1, // TRON
    'ef660437-d915-4e27-ad3f-632bfb6ba0ee': 0.1, // TON

    // USD 0.01
    '6cfe566e-4aad-470b-8c9a-2fd35b49c68d': 0.01, // EOS
    'eea900a8-b327-488c-8d8d-1428702fe240': 0.01, // MobileCoin
    '23dfb5a5-5d7b-48b6-905f-3970e3176e27': 0.01, // Ripple
  };

  constructor(
    private readonly exchangeInitService: ExchangeInitService,
    private readonly mixinClientService: MixinClientService,
  ) {
    this.client = this.mixinClientService.client;
  }

  async calculateMoveFundsFee(
    exchangeName: string,
    pair: string,
    direction: 'deposit_to_exchange' | 'withdraw_to_mixin' | 'withdraw_external',
  ) {
    const [base, quote] = pair.split('/');
    let base_fee, quote_fee;
    let mixin_deposit_fee = 0;
    const creation_fee = 1;

    const base_asset_list = await this.client.network.searchAssets(base);
    const base_asset = base_asset_list[0];
    const quote_asset_list = await this.client.network.searchAssets(quote);
    const quote_asset = quote_asset_list[0];

    try {
      if (direction === 'deposit_to_exchange') {
        base_fee = await this.getMixinWithdrawalFee(base_asset.asset_id);
        quote_fee = await this.getMixinWithdrawalFee(quote_asset.asset_id);

      } else if (direction === 'withdraw_to_mixin') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          base_fee = exchangeFees.baseFee;
          quote_fee = exchangeFees.quoteFee;
        }

        const base_mixin_fee = this.getMixinDepositFee(base_asset.chain_id);
        const quote_mixin_fee = this.getMixinDepositFee(quote_asset.chain_id);
        mixin_deposit_fee = BigNumber(base_mixin_fee).plus(quote_mixin_fee).toNumber();

      } else if (direction === 'withdraw_external') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          base_fee = exchangeFees.baseFee;
          quote_fee = exchangeFees.quoteFee;
        }
      }

    } catch (error) {
      this.logger.error(`Error fetching fees: ${error.message}`);
    }

    return {
      base_asset_id: base_asset.asset_id,
      quote_asset_id: quote_asset.asset_id,
      base_asset_fee: base_fee?.amount,
      quote_asset_fee: quote_fee?.amount,
      creation_fee,
      mixin_deposit_fee,
      direction,
    };
  }

  private async getMixinWithdrawalFee(asset_id: string): Promise<SafeWithdrawalFee> {
    try {
      const asset_detail = await this.client.safe.fetchAsset(asset_id);
      if (asset_detail) {
        // @ts-expect-error fetchFee is not in type definition but exists in SDK as per user
        const fee = await this.client.safe.fetchFee(asset_detail.asset_id);

        return fee[0];
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
    return this.MIXIN_DEPOSIT_FEES[chain_id] || 0;
  }
}
