import * as ccxt from 'ccxt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ExchangeInitService {
  private readonly logger = new CustomLogger(ExchangeInitService.name);
  private exchanges = new Map<string, ccxt.Exchange>();

  constructor() {
    this.initializeExchanges()
      .then(() => this.logger.log('Exchanges initialized successfully.'))
      .catch((error) =>
        this.logger.error('Error during exchanges initialization', error),
      );
  }

  private async initializeExchanges() {
    const exchangeConfigs = [
      {
        name: 'alpaca',
        class: ccxt.pro.alpaca,
        apiKey: process.env.ALPACA_API_KEY,
        secret: process.env.ALPACA_SECRET,
      },
      {
        name: 'okx',
        class: ccxt.pro.okx,
        apiKey: process.env.OKX_API_KEY,
        secret: process.env.OKX_SECRET,
      },
      {
        name: 'bitfinex',
        class: ccxt.pro.bitfinex,
        apiKey: process.env.BITFINEX_API_KEY,
        secret: process.env.BITFINEX_SECRET,
      },
      {
        name: 'gate',
        class: ccxt.pro.gate,
        apiKey: process.env.GATE_API_KEY,
        secret: process.env.GATE_SECRET,
      },
      {
        name: 'mexc',
        class: ccxt.pro.mexc,
        apiKey: process.env.MEXC_API_KEY,
        secret: process.env.MEXC_SECRET,
      },
      {
        name: 'binance',
        class: ccxt.pro.binance,
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
      },
      {
        name: 'lbank',
        class: ccxt.pro.lbank,
        apiKey: process.env.LBANK_API_KEY,
        secret: process.env.LBANK_SECRET,
      },
      {
        name: 'bitmart',
        class: ccxt.pro.bitmart,
        apiKey: process.env.BITMART_API_KEY,
        secret: process.env.BITMART_SECRET,
      },
      {
        name: 'bigone',
        class: ccxt.bigone,
        apiKey: process.env.BIGONE_API_KEY,
        secret: process.env.BIGONE_SECRET,
      },
      {
        name: 'coinlist',
        class: ccxt.coinlist,
        apiKey: process.env.COINLIST_API_KEY,
        secret: process.env.COINLIST_SECRET,
      },
      {
        name: 'bitmart',
        class: ccxt.pro.bitmart,
        apiKey: process.env.BITMART_API_KEY,
        secret: process.env.BITMART_SECRET,
      },
      {
        name: 'p2b',
        class: ccxt.pro.p2b,
        apiKey: process.env.P2B_API_KEY,
        secret: process.env.P2B_SECRET,
      },

      {
        name: 'degifinex',
        class: ccxt.digifinex,
        apiKey: process.env.DEGIFINEX_API_KEY,
        secret: process.env.DEGIFINEX_SECRET,
      },
    ];

    await Promise.all(
      exchangeConfigs.map(async (config) => {
        try {
          if (!config.apiKey || !config.secret) {
            this.logger.warn(
              `API key or secret for ${config.name} is missing. Skipping initialization.`,
            );
            return;
          }
          const exchange = new config.class({
            apiKey: config.apiKey,
            secret: config.secret,
          });
          await exchange.loadMarkets();
          this.exchanges.set(config.name, exchange);
          this.logger.log(`${config.name} initialized successfully.`);
        } catch (error) {
          this.logger.warn(
            `Failed to initialize ${config.name}: ${error.message}`,
          );
        }
      }),
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
