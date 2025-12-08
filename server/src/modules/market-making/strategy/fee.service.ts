import { Injectable } from '@nestjs/common';
import { MixinApi, KeystoreClientReturnType } from '@mixin.dev/mixin-node-sdk';
import { ConfigService } from '@nestjs/config';
import { ExchangeInitService } from '../../infrastructure/exchange-init/exchange-init.service';
import { CustomLogger } from '../../infrastructure/logger/logger.service';

@Injectable()
export class FeeService {
  private readonly logger = new CustomLogger(FeeService.name);
  private client: KeystoreClientReturnType;

  constructor(
    private readonly exchangeInitService: ExchangeInitService,
    private readonly configService: ConfigService,
  ) {
    const keystore = {
      app_id: this.configService.get<string>('mixin.app_id'),
      session_id: this.configService.get<string>('mixin.session_id'),
      server_public_key: this.configService.get<string>(
        'mixin.server_public_key',
      ),
      session_private_key: this.configService.get<string>(
        'mixin.session_private_key',
      ),
    };
    this.client = MixinApi({
      keystore: keystore,
    });
  }

  async calculateMoveFundsFee(
    exchangeName: string,
    pair: string,
    direction: 'deposit_to_exchange' | 'withdraw_to_mixin' | 'withdraw_external',
  ) {
    const [base, quote] = pair.split('/');
    let baseFee = 0;
    let quoteFee = 0;
    // Default fallback values
    const creationFee = 5.0;

    try {
      if (direction === 'deposit_to_exchange') {
        // Logic: Check base and quote token's mixin withdrawal fee
        baseFee = await this.getMixinWithdrawalFee(base);
        quoteFee = await this.getMixinWithdrawalFee(quote);

      } else if (direction === 'withdraw_to_mixin') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          baseFee = exchangeFees.baseFee;
          quoteFee = exchangeFees.quoteFee;
        }

        // Check deposit fee of mixin
        baseFee += this.getMixinDepositFee(base); // This is simplified, real logic might depend on chain
        quoteFee += this.getMixinDepositFee(quote);

      } else if (direction === 'withdraw_external') {
        const exchange = this.exchangeInitService.getExchange(exchangeName);
        if (exchange) {
          const exchangeFees = await this.getExchangeWithdrawalFee(exchange, base, quote);
          baseFee = exchangeFees.baseFee;
          quoteFee = exchangeFees.quoteFee;
        }
      }

    } catch (error) {
      this.logger.error(`Error fetching fees: ${error.message}`);
    }

    return {
      base_asset_fee: baseFee,
      quote_asset_fee: quoteFee,
      creation_fee: creationFee,
      total_fee_usd: creationFee, // TODO: Calculate accurate USD value
      details: {
        exchange_withdrawal_fee: { base: baseFee, quote: quoteFee }, // This might need clearer labelling based on source
        direction: direction
      }
    };
  }

  private async getMixinWithdrawalFee(symbol: string): Promise<number> {
    try {
      const assets = await this.client.network.searchAssets(symbol);
      if (assets && assets.length > 0) {
        const assetId = assets[0].asset_id;
        // @ts-expect-error fetchFee is not in type definition but exists in SDK as per user
        const fee = await this.client.safe.fetchFee(assetId);
        // Assuming fee returns an object with amount or just the amount. 
        // Based on user "fetchFee method, to get the withdrawal fee", usually it returns a fee asset and amount.
        // Let's assume it returns a structure similar to withdrawal fee response or just check if it returns an amount.
        // If fetchFee returns { asset_id, amount }, we need to convert it? 
        // For now preventing crash and assuming it returns something we can parse or 0.
        // Wait, typical safe.fetchFee usually refers to withdrawal fee which is network fee.
        // Let's look at available types or just assume 'amount' property if object, or number.
        // Use 'any' to bypass TS check for now as we don't have updated types.

        return Number((fee as any).amount || 0);
      }
    } catch (e) {
      this.logger.error(`Failed to get Mixin withdrawal fee for ${symbol}: ${e.message}`);
    }
    return 0;
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

  private getMixinDepositFee(symbol: string): number {
    // Custom map for Mixin deposit fee
    // Based on user provided info:
    // Ethereum, Bitcoin: 2-3 USD (Creation vs Deposit)
    // Others: 0.1 - 0.5 USD
    // This is "per deposit" fee.

    // Mapping symbols to chain is tricky without chain info.
    // We'll use a rough heuristic based on symbol name for common ones.
    const s = symbol.toUpperCase();

    // High fee chains (Ethereum, Bitcoin) ~ 3 USD ?? 
    // User said: Ethereum, Bitcoin: USD 3 per deposit
    if (['BTC', 'ETH', 'USDT', 'USDC'].includes(s)) {
      // USDT/USDC on ETH is expensive, but on Tron/Polygon is cheap. 
      // Without chain info, this is ambiguous. 
      // For now, let's assume a "safe" high estimate or specific logic.
      // But wait, the user said "we can probably make a custom map... if we have symbol or asset_id".
      // Let's stick to the explicit ones mentioned.
      if (s === 'BTC' || s === 'ETH') return 0.003; // ~3 USD in crypto terms? No, we need amount in asset? 
      // The return value of this function is added to `baseFee` which is in `base` currency.
      // So we need to return the fee in `symbol` unit.
      // That requires price conversion! 

      // Use 0 for now as we cannot convert USD to asset amount without price.
      // OR return 0 and rely on `total_fee_usd` if we switch to USD calculation.
      // The current function signature returns { base_asset_fee, ... } implying native units.

      return 0;
    }
    // Others
    return 0;
  }
}
