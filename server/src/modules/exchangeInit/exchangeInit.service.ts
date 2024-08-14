import * as ccxt from 'ccxt';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ExchangeInitService {
  private readonly logger = new CustomLogger(ExchangeInitService.name);
  private exchanges = new Map<string, Map<string, ccxt.Exchange>>();
  private defaultAccounts = new Map<string, ccxt.Exchange>();
  private unauthenticatedExchanges = new Map<string, ccxt.Exchange>();
  private exchangeConfigs = [
    {
      name: 'okx',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.OKX_API_KEY,
          secret: process.env.OKX_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.OKX_API_KEY_2,
          secret: process.env.OKX_SECRET_2,
        },
      ],
      class: ccxt.pro.okx,
    },
    {
      name: 'bitfinex',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.BITFINEX_API_KEY,
          secret: process.env.BITFINEX_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.BITFINEX_API_KEY_2,
          secret: process.env.BITFINEX_SECRET_2,
        },
      ],
      class: ccxt.pro.bitfinex,
    },
    {
      name: 'gate',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.GATE_API_KEY,
          secret: process.env.GATE_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.GATE_API_KEY_2,
          secret: process.env.GATE_SECRET_2,
        },
      ],
      class: ccxt.pro.gate,
    },
    {
      name: 'mexc',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.MEXC_API_KEY,
          secret: process.env.MEXC_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.MEXC_API_KEY_2,
          secret: process.env.MEXC_SECRET_2,
        },
      ],
      class: ccxt.pro.mexc,
    },
    {
      name: 'binance',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.BINANCE_API_KEY,
          secret: process.env.BINANCE_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.BINANCE_API_KEY_2,
          secret: process.env.BINANCE_SECRET_2,
        },
      ],
      class: ccxt.pro.binance,
    },
    {
      name: 'lbank',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.LBANK_API_KEY,
          secret: process.env.LBANK_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.LBANK_API_KEY_2,
          secret: process.env.LBANK_SECRET_2,
        },
      ],
      class: ccxt.pro.lbank,
    },
    {
      name: 'bitmart',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.BITMART_API_KEY,
          secret: process.env.BITMART_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.BITMART_API_KEY_2,
          secret: process.env.BITMART_SECRET_2,
        },
      ],
      class: ccxt.pro.bitmart,
    },
    {
      name: 'bigone',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.BIGONE_API_KEY,
          secret: process.env.BIGONE_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.BIGONE_API_KEY_2,
          secret: process.env.BIGONE_SECRET_2,
        },
      ],
      class: ccxt.bigone,
    },
    {
      name: 'coinlist',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.COINLIST_API_KEY,
          secret: process.env.COINLIST_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.COINLIST_API_KEY_2,
          secret: process.env.COINLIST_SECRET_2,
        },
      ],
      class: ccxt.coinlist,
    },
    {
      name: 'p2b',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.P2B_API_KEY,
          secret: process.env.P2B_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.P2B_API_KEY_2,
          secret: process.env.P2B_SECRET_2,
        },
      ],
      class: ccxt.pro.p2b,
    },
    {
      name: 'probit',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.PROBIT_API_KEY,
          secret: process.env.PROBIT_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.PROBIT_API_KEY_2,
          secret: process.env.PROBIT_SECRET_2,
        },
      ],
      class: ccxt.pro.probit,
    },
    {
      name: 'digifinex',
      accounts: [
        {
          label: 'default',
          apiKey: process.env.DIGIFINEX_API_KEY,
          secret: process.env.DIGIFINEX_SECRET,
        },
        {
          label: 'account2',
          apiKey: process.env.DIGIFINEX_API_KEY_2,
          secret: process.env.DIGIFINEX_SECRET_2,
        },
      ],
      class: ccxt.digifinex,
    },
  ];

  constructor() {
    this.initializeExchanges()
      .then(() => this.logger.log('Exchanges initialized successfully.'))
      .catch((error) =>
        this.logger.error('Error during exchanges initialization', error),
      );
    this.initializeUnauthenticatedExchanges()
      .then(() => {})
      .catch((error) =>
        this.logger.error('Error during market data initialization', error),
      );
  }

  private async initializeExchanges() {
    await Promise.all(
      this.exchangeConfigs.map(async (config) => {
        const exchangeMap = new Map<string, ccxt.Exchange>();
        await Promise.all(
          config.accounts.map(async (account) => {
            try {
              if (!account.apiKey || !account.secret) {
                this.logger.warn(
                  `API key or secret for ${config.name} ${account.label} is missing. Skipping initialization.`,
                );
                return;
              }
              const exchange = new config.class({
                apiKey: account.apiKey,
                secret: account.secret,
              });
              await exchange.loadMarkets();
              exchangeMap.set(account.label, exchange);
              this.logger.log(
                `${config.name} ${account.label} initialized successfully.`,
              );
              if (account.label === 'default') {
                this.defaultAccounts.set(config.name, exchange);
              }
            } catch (error) {
              this.logger.warn(
                `Failed to initialize ${config.name} ${account.label}: ${error.message}`,
              );
            }
          }),
        );
        this.exchanges.set(config.name, exchangeMap);
      }),
    );
  }

  getExchange(exchangeName: string, label: string = 'default'): ccxt.Exchange {
    const exchangeMap = this.exchanges.get(exchangeName);
    if (!exchangeMap) {
      this.logger.error(`Exchange ${exchangeName} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    const exchange = exchangeMap.get(label);
    if (!exchange) {
      this.logger.error(
        `Exchange ${exchangeName} with label ${label} is not configured.`,
      );
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    return exchange;
  }

  getSupportedExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }

  getAccountsForExchange(exchangeName: string): string[] {
    const exchangeMap = this.exchanges.get(exchangeName);
    if (!exchangeMap) {
      this.logger.error(`Exchange ${exchangeName} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    return Array.from(exchangeMap.keys());
  }

  getDefaultExchange(exchangeName: string): ccxt.Exchange {
    const exchange = this.defaultAccounts.get(exchangeName);
    if (!exchange) {
      this.logger.error(`Default exchange ${exchangeName} is not configured.`);
      throw new InternalServerErrorException(
        'Default exchange configuration error.',
      );
    }
    return exchange;
  }

  private async initializeUnauthenticatedExchanges() {
    await Promise.all(
      this.exchangeConfigs.map(async (config) => {
        const exchangeClass = config.class;
        if (!exchangeClass) {
          throw new Error(`Exchange class not found for ${config.name}`);
        }
        const exchange = new exchangeClass();
        try {
          await exchange.loadMarkets();
          this.unauthenticatedExchanges.set(config.name, exchange);
        } catch (error) {
          this.logger.warn(
            `Failed to initialize unauthenticated exchange instance for ${config.name}: ${error.message}`,
          );
        }
      }),
    );
  }

  getMarketdataInstance(name: string): ccxt.Exchange | null {
    return this.unauthenticatedExchanges.get(name) || null;
  }
}
