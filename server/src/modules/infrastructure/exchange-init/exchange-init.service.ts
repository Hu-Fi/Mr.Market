import * as ccxt from 'ccxt';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Injectable({ scope: Scope.DEFAULT })
export class ExchangeInitService {
  private readonly logger = new CustomLogger(ExchangeInitService.name);
  private exchanges = new Map<string, Map<string, ccxt.Exchange>>();
  private defaultAccounts = new Map<string, ccxt.Exchange>();

  constructor() {
    this.initializeExchanges()
      .then(() => {
        this.logger.log('Exchanges initialized successfully.');
        this.startKeepAlive();
      })
      .catch((error) =>
        this.logger.error(
          'Error during exchanges initialization',
          error.message,
        ),
      );
  }

  private async initializeExchanges() {
    const exchangeConfigs = [
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
          {
            label: 'read-only',
            apiKey: process.env.OKX_API_KEY_READ_ONLY,
            secret: process.env.OKX_SECRET_READ_ONLY,
          },
        ],
        class: ccxt.pro.okx,
      },
      {
        name: 'alpaca',
        accounts: [
          {
            label: 'default',
            apiKey: process.env.ALPACA_KEY,
            secret: process.env.ALPACA_SECRET,
          },
          {
            label: 'account2',
            apiKey: process.env.ALPACA_KEY_2,
            secret: process.env.ALPACA_SECRET_2,
          },
          {
            label: 'read-only',
            apiKey: process.env.ALPACA_KEY_READ_ONLY,
            secret: process.env.ALPACA_SECRET_READ_ONLY,
          },
        ],
        class: ccxt.pro.alpaca,
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
          {
            label: 'read-only',
            apiKey: process.env.BITFINEX_API_KEY_READ_ONLY,
            secret: process.env.BITFINEX_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.GATE_API_KEY_READ_ONLY,
            secret: process.env.GATE_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.MEXC_API_KEY_READ_ONLY,
            secret: process.env.MEXC_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.BINANCE_API_KEY_READ_ONLY,
            secret: process.env.BINANCE_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.LBANK_API_KEY_READ_ONLY,
            secret: process.env.LBANK_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.BITMART_API_KEY_READ_ONLY,
            secret: process.env.BITMART_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.BIGONE_API_KEY_READ_ONLY,
            secret: process.env.BIGONE_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.COINLIST_API_KEY_READ_ONLY,
            secret: process.env.COINLIST_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.P2B_API_KEY_READ_ONLY,
            secret: process.env.P2B_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.PROBIT_API_KEY_READ_ONLY,
            secret: process.env.PROBIT_SECRET_READ_ONLY,
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
          {
            label: 'read-only',
            apiKey: process.env.DIGIFINEX_API_KEY_READ_ONLY,
            secret: process.env.DIGIFINEX_SECRET_READ_ONLY,
          },
        ],
        class: ccxt.digifinex,
      },
    ];

    await Promise.all(
      exchangeConfigs.map(async (config) => {
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

              // Load markets
              await exchange.loadMarkets();

              // Call signIn only for ProBit accounts
              if (config.name === 'probit' && exchange.has['signIn']) {
                try {
                  await exchange.signIn();
                  this.logger.log(
                    `${config.name} ${account.label} signed in successfully.`,
                  );
                } catch (error) {
                  this.logger.error(
                    `ProBit ${account.label} sign-in failed: ${error.message}`,
                  );
                }
              }

              // Save the initialized exchange
              exchangeMap.set(account.label, exchange);
              this.logger.log(
                `${config.name} ${account.label} initialized successfully.`,
              );

              // Save the default account reference
              if (account.label === 'default') {
                this.defaultAccounts.set(config.name, exchange);
              }
            } catch (error) {
              this.logger.error(
                `Failed to initialize ${config.name} ${account.label}: ${error.message}`,
              );
            }
          }),
        );

        this.exchanges.set(config.name, exchangeMap);
      }),
    );
  }

  private startKeepAlive() {
    const intervalMs = 5 * 60 * 1000; // 5 minutes

    setInterval(async () => {
      this.logger.log('Running keep-alive checks for all exchanges...');
      for (const [exchangeName, accounts] of this.exchanges) {
        // Only do special logic for ProBit
        if (exchangeName === 'probit') {
          for (const [label, exchange] of accounts) {
            try {
              // If the exchange does not have signIn, skip
              if (!exchange.has['signIn']) {
                this.logger.log(
                  `ProBit ${label} does not support signIn. Skipping...`,
                );
                continue;
              }

              // Check for open orders
              const openOrders = await exchange.fetchOpenOrders();
              if (openOrders.length > 0) {
                this.logger.log(
                  `ProBit ${label} has open orders. Skipping signIn to avoid resetting them.`,
                );
                continue; // Do not signIn
              }

              // Otherwise, signIn if no open orders
              await exchange.signIn();
              this.logger.log(`ProBit ${label} re-signed in successfully.`);
            } catch (error) {
              this.logger.error(
                `ProBit ${label} keep-alive signIn failed: ${error.message}`,
              );
            }
          }
        }
        // other exchange keep-alive logic if needed...
      }
    }, intervalMs);
  }

  getExchange(exchangeName: string, label: string = 'default'): ccxt.Exchange {
    const exchangeMap = this.exchanges.get(exchangeName);
    if (!exchangeMap) {
      this.logger.warn(`Exchange ${exchangeName} is not configured.`);
      throw new InternalServerErrorException('Exchange configuration error.');
    }
    const exchange = exchangeMap.get(label);
    if (!exchange) {
      this.logger.warn(
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
  /**
   * Function to get the deposit address for a specific token on a specific network
   * @param exchangeName - The name of the exchange
   * @param tokenSymbol - The symbol of the token (e.g., 'USDT')
   * @param network - The network (e.g., 'ERC20', 'BSC')
   * @param label - Optional account label
   */
  async getDepositAddress(
    exchangeName: string,
    tokenSymbol: string,
    network: string,
    label: string = 'default',
  ): Promise<string> {
    try {
      const exchange = this.getExchange(exchangeName, label);
      if (!exchange.has['fetchDepositAddress']) {
        throw new InternalServerErrorException(
          `Exchange ${exchangeName} does not support fetching deposit addresses.`,
        );
      }

      const params = network ? { network } : {};
      const addressInfo = await exchange.fetchDepositAddress(
        tokenSymbol,
        params,
      );

      if (!addressInfo || !addressInfo.address) {
        throw new InternalServerErrorException(
          `Unable to fetch deposit address for ${tokenSymbol} on ${network} network from ${exchangeName}.`,
        );
      }

      return addressInfo.address;
    } catch (error) {
      this.logger.error(
        `Error fetching deposit address for ${tokenSymbol} on ${network} from ${exchangeName}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to get deposit address.');
    }
  }

  getAllCcxtExchanges(): string[] {
    return (ccxt as any).exchanges;
  }

  async getCcxtExchangeDetails(exchangeId: string): Promise<any> {
    if (!(ccxt as any).exchanges.includes(exchangeId)) {
      throw new BadRequestException(
        `Exchange ${exchangeId} is not supported by CCXT.`,
      );
    }

    try {
      // Instantiate the exchange to get its properties
      // We don't need API keys for this
      const exchangeClass = ccxt[exchangeId];
      const exchange = new exchangeClass();

      return {
        id: exchange.id,
        name: exchange.name,
        urls: exchange.urls,
        countries: exchange.countries,
        version: exchange.version,
        // Add other metadata if needed
      };
    } catch (error) {
      this.logger.error(
        `Failed to get details for ${exchangeId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to get details for ${exchangeId}`,
      );
    }
  }

  async getCcxtExchangeMarkets(exchangeId: string): Promise<any> {
    if (!(ccxt as any).exchanges.includes(exchangeId)) {
      throw new BadRequestException(
        `Exchange ${exchangeId} is not supported by CCXT.`,
      );
    }

    try {
      const exchangeClass = ccxt[exchangeId];
      const exchange = new exchangeClass();

      // Some exchanges require loading markets to get the list
      // Since we are not authenticated, we can only get public markets
      await exchange.loadMarkets();

      return Object.values(exchange.markets).map((market: any) => ({
        symbol: market.symbol,
        base: market.base,
        quote: market.quote,
        baseId: market.baseId,
        quoteId: market.quoteId,
        active: market.active,
        id: market.id,
        precision: market.precision,
        limits: market.limits,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get markets for ${exchangeId}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to get markets for ${exchangeId}`,
      );
    }
  }
}
