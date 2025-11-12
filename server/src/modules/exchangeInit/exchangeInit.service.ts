import * as ccxt from 'ccxt';
import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';

type ExchangeCtor = new (params?: any) => ccxt.Exchange;

interface ExchangeConfig {
  name: string;
  class: ExchangeCtor;
  defaultType?: 'spot' | 'swap' | 'future';
}

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
          error?.message ?? String(error),
        ),
      );
  }

  /** ---------- utils ---------- */

  /** read env and hard-trim (kills stray spaces/newlines that break signatures) */
  private envTrim(name: string): string | undefined {
    const v = process.env[name];
    return typeof v === 'string' ? v.trim() : v;
  }

  private makeExchangeId(name: string, isTestnet: boolean) {
    return isTestnet ? `${name}-testnet` : name;
  }

  /** build a ccxt instance with safe defaults */
  private buildExchangeInstance(
    Ctor: ExchangeCtor,
    {
      apiKey,
      secret,
      password,
      defaultType = 'spot',
    }: { apiKey?: string; secret?: string; password?: string; defaultType?: 'spot' | 'swap' | 'future' },
  ) {
    const ex = new Ctor({
      apiKey,
      secret,
      password,
      enableRateLimit: true,
      // some exchanges look at options.defaultType for spot/swap routing
      options: {
        ...(defaultType ? { defaultType } : {}),
      },
      // strict SSL can save you from weird proxies
      timeout: 20000,
      verbose: false,
    } as ccxt.Exchange);

    // Prefer to keep clocks aligned automatically whenever the exchange supports it
    // For Binance this is options.adjustForTimeDifference, for others we log skew below.
    try {
      (ex.options as any).adjustForTimeDifference = true;
    } catch {/* ignore if not supported */}
    return ex;
  }

  /** quick targeted diagnostics to catch auth/time issues early */
  private async postInitDiagnostics(
    exName: string,
    label: string,
    exchange: ccxt.Exchange,
  ) {
    // 1) time skew
    try {
      const serverTime = await exchange.fetchTime();
      if (serverTime && Number.isFinite(serverTime)) {
        const skewMs = serverTime - Date.now();
        const absSkew = Math.abs(skewMs);
        const skewMsg = `[${exName}:${label}] time skew ${skewMs}ms`;
        if (absSkew > 5000) {
          this.logger.warn(`${skewMsg} → consider NTP sync to avoid signature errors.`);
        } else {
          this.logger.log(skewMsg);
        }
      }
    } catch {
      // not all exchanges expose fetchTime
    }

    // 2) private call smoke-test (fetchBalance) to surface INVALID_SIGNATURE now
    try {
      // Only if credentials exist (ccxt will throw otherwise)
      if (exchange.apiKey && exchange.secret) {
        await exchange.fetchBalance();
        this.logger.log(`[${exName}:${label}] fetchBalance OK (creds valid).`);
      }
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      // Surface common root causes explicitly
      if (/INVALID_SIGNATURE|Signature mismatch|auth|signature/i.test(msg)) {
        this.logger.error(
          `[${exName}:${label}] auth/signature failed → ` +
          `check key/secret trimming, permissions, IP whitelist, and testnet vs mainnet. Raw: ${msg}`,
        );
      } else if (/timestamp|request expired|time/i.test(msg)) {
        this.logger.error(
          `[${exName}:${label}] request time issue → clock skew. Raw: ${msg}`,
        );
      } else {
        this.logger.error(`[${exName}:${label}] private-call check failed: ${msg}`);
      }
    }
  }

  /** ---------- init ---------- */

  private async initializeExchanges() {
    const exchangeConfigs: ExchangeConfig[] = [
      { name: 'okx', class: (ccxt as any).pro.okx },
      { name: 'alpaca', class: (ccxt as any).pro.alpaca },
      { name: 'bitfinex', class: (ccxt as any).pro.bitfinex },
      { name: 'gate', class: (ccxt as any).pro.gate, defaultType: 'spot' },
      { name: 'mexc', class: (ccxt as any).pro.mexc, defaultType: 'spot' },
      { name: 'xt', class: (ccxt as any).pro.xt, defaultType: 'spot' },
      { name: 'binance', class: (ccxt as any).pro.binance, defaultType: 'spot' },
      { name: 'bybit', class: (ccxt as any).pro.bybit, defaultType: 'spot' },
      { name: 'lbank', class: (ccxt as any).pro.lbank, defaultType: 'spot' },
      { name: 'bitmart', class: (ccxt as any).pro.bitmart, defaultType: 'spot' },
      { name: 'bigone', class: (ccxt as any).bigone, defaultType: 'spot' },
      { name: 'p2b', class: (ccxt as any).pro.p2b, defaultType: 'spot' },
      { name: 'probit', class: (ccxt as any).pro.probit, defaultType: 'spot' },
      { name: 'digifinex', class: (ccxt as any).digifinex, defaultType: 'spot' },
    ];

    await Promise.all(
      exchangeConfigs.map(async (cfg) => {
        const names = [cfg.name, `${cfg.name}-testnet`];

        for (const rawName of names) {
          const exchangeMap = new Map<string, ccxt.Exchange>();
          const isTestnet = rawName.endsWith('-testnet');
          const exName = this.makeExchangeId(cfg.name, isTestnet);

          const accounts = [
            {
              label: 'default',
              apiKey: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_API_KEY`,
              ),
              secret: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_SECRET`,
              ),
              password: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_PASSWORD`,
              ), // OKX etc.
            },
            {
              label: 'account2',
              apiKey: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_API_KEY_2`,
              ),
              secret: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_SECRET_2`,
              ),
              password: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_PASSWORD_2`,
              ),
            },
            {
              label: 'read-only',
              apiKey: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_API_KEY_READ_ONLY`,
              ),
              secret: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_SECRET_READ_ONLY`,
              ),
              password: this.envTrim(
                `${cfg.name.toUpperCase()}${isTestnet ? '_TESTNET' : ''}_PASSWORD_READ_ONLY`,
              ),
            },
          ];

          await Promise.all(
            accounts.map(async (acct) => {
              try {
                if (!acct.apiKey || !acct.secret) {
                  // this.logger.log(
                  //   `[${exName}:${acct.label}] skipped (missing API key/secret).`,
                  // );
                  return;
                }

                const exchange = this.buildExchangeInstance(cfg.class, {
                  apiKey: acct.apiKey,
                  secret: acct.secret,
                  password: acct.password,
                  defaultType: cfg.defaultType ?? 'spot',
                });

                // Testnet routing where supported
                if (isTestnet && typeof (exchange as any).setSandboxMode === 'function') {
                  (exchange as any).setSandboxMode(true);
                  this.logger.log(`[${exName}:${acct.label}] sandbox mode ON.`);
                }

                // Preload markets to configure symbol routing/types
                await exchange.loadMarkets();

                // ProBit requires signIn for private endpoints
                if (cfg.name === 'probit' && exchange.has?.signIn) {
                  try {
                    await (exchange as any).signIn();
                    this.logger.log(`[${exName}:${acct.label}] signIn OK.`);
                  } catch (error: any) {
                    this.logger.error(
                      `[${exName}:${acct.label}] signIn failed: ${error?.message ?? error}`,
                    );
                  }
                }

                // Diagnostics (time skew + auth smoke test)
                await this.postInitDiagnostics(exName, acct.label, exchange);

                exchangeMap.set(acct.label, exchange);
                if (acct.label === 'default') {
                  this.defaultAccounts.set(exName, exchange);
                }

                this.logger.log(`[${exName}:${acct.label}] initialized.`);
              } catch (error: any) {
                this.logger.error(
                  `Failed to initialize [${exName}:${acct.label}]: ${error?.message ?? error}`,
                );
              }
            }),
          );

          this.exchanges.set(exName, exchangeMap);
        }
      }),
    );
  }

  /** ---------- keep-alive ---------- */

  private startKeepAlive() {
    const intervalMs = 5 * 60 * 1000; // 5 minutes

    setInterval(async () => {
      this.logger.log('Running keep-alive checks for all exchanges...');
      for (const [exchangeName, accounts] of this.exchanges) {
        // ProBit token expires; keep it fresh but avoid resetting open orders
        if (exchangeName.startsWith('probit')) {
          for (const [label, exchange] of accounts) {
            try {
              if (!exchange.has?.signIn) {
                this.logger.log(`ProBit ${label} has no signIn. Skipping...`);
                continue;
              }

              const openOrders = await exchange.fetchOpenOrders();
              if (openOrders.length > 0) {
                this.logger.log(
                  `ProBit ${label} has open orders → skipping signIn to avoid resets.`,
                );
                continue;
              }

              await (exchange as any).signIn();
              this.logger.log(`ProBit ${label} re-signed in successfully.`);
            } catch (error: any) {
              this.logger.error(
                `ProBit ${label} keep-alive signIn failed: ${error?.message ?? error}`,
              );
            }
          }
        }
      }
    }, intervalMs);
  }

  /** ---------- getters ---------- */

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

  /** ---------- helpers ---------- */

  async getDepositAddress(
    exchangeName: string,
    tokenSymbol: string,
    network: string,
    label: string = 'default',
  ): Promise<string> {
    try {
      const exchange = this.getExchange(exchangeName, label);
      if (!exchange.has?.fetchDepositAddress) {
        throw new InternalServerErrorException(
          `Exchange ${exchangeName} does not support fetching deposit addresses.`,
        );
      }

      const params = network ? { network } : {};
      const addressInfo = await exchange.fetchDepositAddress(tokenSymbol, params);

      if (!addressInfo || !addressInfo.address) {
        throw new InternalServerErrorException(
          `Unable to fetch deposit address for ${tokenSymbol} on ${network} network from ${exchangeName}.`,
        );
      }

      return addressInfo.address;
    } catch (error: any) {
      this.logger.error(
        `Error fetching deposit address for ${tokenSymbol} on ${network} from ${exchangeName}: ${error?.message ?? error}`,
      );
      throw new InternalServerErrorException('Failed to get deposit address.');
    }
  }
}
