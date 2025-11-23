import { Injectable } from '@nestjs/common';
import { ExchangeInitService } from '../../infrastructure/exchange-init/exchange-init.service';
import { CustomLogger } from '../../infrastructure/logger/logger.service';

@Injectable()
export class FeeService {
  private readonly logger = new CustomLogger(FeeService.name);

  constructor(private readonly exchangeInitService: ExchangeInitService) { }

  async calculateInitializationFee(
    exchangeName: string,
    pair: string,
    direction: 'deposit_to_exchange' | 'withdraw_to_mixin' | 'withdraw_external',
  ) {
    const exchange = this.exchangeInitService.getExchange(exchangeName);
    if (!exchange) {
      throw new Error(`Exchange ${exchangeName} not found`);
    }

    const [base, quote] = pair.split('/');
    // Default values if fetch fails
    let baseFee = 0;
    let quoteFee = 0;
    let creationFee = 5.0; // Fixed USD value

    try {
      // Try to fetch transaction fees
      if (exchange.has['fetchTransactionFees']) {
        const fees = await exchange.fetchTransactionFees([base, quote]);
        if (fees) {
          if (fees[base]) baseFee = fees[base].withdraw || 0;
          if (fees[quote]) quoteFee = fees[quote].withdraw || 0;
        }
      } else if (exchange.has['fetchDepositAddress']) {
        // Fallback: some exchanges return fees in deposit address info or currencies
        if (exchange.currencies) {
          if (exchange.currencies[base]) baseFee = exchange.currencies[base].fee || 0;
          if (exchange.currencies[quote]) quoteFee = exchange.currencies[quote].fee || 0;
        }
      }

      // For deposit_to_exchange, we assume Mixin withdrawal fee is needed.
      // Since we don't have direct Mixin API here yet, we might use placeholders or config.
      // For now, we will assume the "withdrawal fee" from exchange is a good proxy for "network fee" 
      // or set a standard fallback.

      // In a real scenario, we would query Mixin Network for withdrawal fees.
      // For this implementation, we will use the exchange's withdrawal fee as a safe estimate for network costs.

    } catch (error) {
      this.logger.error(`Error fetching fees: ${error.message}`);
    }

    return {
      base_asset_fee: baseFee,
      quote_asset_fee: quoteFee,
      creation_fee: creationFee,
      total_fee_usd: creationFee, // This should ideally calculate USD value of base/quote fees
      details: {
        exchange_withdrawal_fee: { base: baseFee, quote: quoteFee },
        direction: direction
      }
    };
  }
}
