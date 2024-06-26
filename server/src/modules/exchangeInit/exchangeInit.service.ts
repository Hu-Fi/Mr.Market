import * as ccxt from 'ccxt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ExchangeInitService {
  private readonly logger = new CustomLogger(ExchangeInitService.name);
  private exchanges = new Map<string, ccxt.Exchange>();

  constructor() {
    this.initializeExchanges();
  }

  private initializeExchanges() {
    // Initialize exchanges
    this.exchanges.set(
      'okx',
      new ccxt.pro.okx({
        apiKey: process.env.OKX_API_KEY,
        secret: process.env.OKX_SECRET,
      }),
    );
    this.exchanges.set(
      'bitfinex',
      new ccxt.pro.bitfinex({
        apiKey: process.env.BITFINEX_API_KEY,
        secret: process.env.BITFINEX_SECRET,
      }),
    );
    this.exchanges.set(
      'mexc',
      new ccxt.pro.mexc({
        apiKey: process.env.MEXC_API_KEY,
        secret: process.env.MEXC_SECRET,
      }),
    );
    this.exchanges.set(
      'binance',
      new ccxt.pro.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
      }),
    );
    this.exchanges.set(
      'lbank',
      new ccxt.pro.lbank({
        apiKey: process.env.LBANK_API_KEY,
        secret: process.env.LBANK_SECRET,
      }),
    );
    this.exchanges.set(
      'bigone',
      new ccxt.bigone({
        apiKey: process.env.BIGONE_API_KEY,
        secret: process.env.BIGONE_SECRET,
      }),
    );
    this.exchanges.set(
        'bitmart',
        new ccxt.pro.bitmart({
            apiKey: process.env.BITMART_API_KEY,
            secret: process.env.BITMART_SECRET,
        })
    );
  }

  getExchange(exchangeName: string): ccxt.Exchange {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange) {
      this.logger.error(`Exchange ${exchangeName} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    return exchange;
  }

  getSupportedExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }
}
