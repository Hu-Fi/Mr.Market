import * as ccxt from 'ccxt';
import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';

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
      { name: 'okx', class: ccxt.pro.okx },
      { name: 'alpaca', class: ccxt.pro.alpaca },
      { name: 'bitfinex', class: ccxt.pro.bitfinex },
      { name: 'gate', class: ccxt.pro.gate },
      { name: 'mexc', class: ccxt.pro.mexc },
      { name: 'xt', class: ccxt.pro.xt },
      { name: 'binance', class: ccxt.pro.binance },
      { name: 'bybit', class: ccxt.pro.bybit },
      { name: 'lbank', class: ccxt.pro.lbank },
      { name: 'bitmart', class: ccxt.pro.bitmart },
      { name: 'bigone', class: ccxt.bigone },
      { name: 'p2b', class: ccxt.pro.p2b },
      { name: 'probit', class: ccxt.pro.probit },
      { name: 'digifinex', class: ccxt.digifinex },
    ];

    await Promise.all(
      exchangeConfigs.map(async (config) => {
        const exchangeNames = [config.name, `${config.name}-testnet`];

        for (const exName of exchangeNames) {
          const exchangeMap = new Map<string, ccxt.Exchange>();
          const isTestnet = exName.endsWith('-testnet');

          const accounts = [
            {
              label: 'default',
              apiKey:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_API_KEY`
                ],
              secret:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_SECRET`
                ],
            },
            {
              label: 'account2',
              apiKey:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_API_KEY_2`
                ],
              secret:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_SECRET_2`
                ],
            },
            {
              label: 'read-only',
              apiKey:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_API_KEY_READ_ONLY`
                ],
              secret:
                process.env[
                  `${config.name.toUpperCase()}${
                    isTestnet ? '_TESTNET' : ''
                  }_SECRET_READ_ONLY`
                ],
            },
          ];

          await Promise.all(
            accounts.map(async (account) => {
              try {
                if (!account.apiKey || !account.secret) {
                  return;
                }

                const exchange = new config.class({
                  apiKey: account.apiKey,
                  secret: account.secret,
                });

                // 🔹 Enable sandbox if testnet
                if (
                  isTestnet &&
                  typeof exchange.setSandboxMode === 'function'
                ) {
                  exchange.setSandboxMode(true);
                  this.logger.log(
                    `${exName} ${account.label} sandbox mode activated.`,
                  );
                }

                await exchange.loadMarkets();

                // Special signIn for ProBit
                if (config.name === 'probit' && exchange.has['signIn']) {
                  try {
                    await exchange.signIn();
                    this.logger.log(
                      `${exName} ${account.label} signed in successfully.`,
                    );
                  } catch (error) {
                    this.logger.error(
                      `${exName} ${account.label} sign-in failed: ${error.message}`,
                    );
                  }
                }

                exchangeMap.set(account.label, exchange);

                if (account.label === 'default') {
                  this.defaultAccounts.set(exName, exchange);
                }

                this.logger.log(
                  `${exName} ${account.label} initialized successfully.`,
                );
              } catch (error) {
                this.logger.error(
                  `Failed to initialize ${exName} ${account.label}: ${error.message}`,
                );
              }
            }),
          );

          this.exchanges.set(exName, exchangeMap);
        }
      }),
    );
  }

  private startKeepAlive() {
    const intervalMs = 5 * 60 * 1000; // 5 minutes

    setInterval(async () => {
      this.logger.log('Running keep-alive checks for all exchanges...');
      for (const [exchangeName, accounts] of this.exchanges) {
        if (exchangeName.startsWith('probit')) {
          for (const [label, exchange] of accounts) {
            try {
              if (!exchange.has['signIn']) {
                this.logger.log(
                  `ProBit ${label} does not support signIn. Skipping...`,
                );
                continue;
              }

              const openOrders = await exchange.fetchOpenOrders();
              if (openOrders.length > 0) {
                this.logger.log(
                  `ProBit ${label} has open orders. Skipping signIn to avoid resetting them.`,
                );
                continue;
              }

              await exchange.signIn();
              this.logger.log(`ProBit ${label} re-signed in successfully.`);
            } catch (error) {
              this.logger.error(
                `ProBit ${label} keep-alive signIn failed: ${error.message}`,
              );
            }
          }
        }
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
}
