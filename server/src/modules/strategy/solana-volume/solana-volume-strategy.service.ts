import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  PublicKey,
  VersionedTransaction,
  Keypair,
} from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { createJupiterApiClient, QuoteResponse } from '@jup-ag/api';
import * as fs from 'fs';
import { getMint } from '@solana/spl-token';
import bs58 from 'bs58'; // npm i bs58

import {
  VolumeStrategyConfig,
  StrategyInstance,
  TradeData,
} from './solana-volume.types';
import { parsePrivateKeyToUint8Array } from 'src/common/helpers/key-utils';

type JupiterClient = ReturnType<typeof createJupiterApiClient>;

@Injectable()
export class SolanaVolumeStrategyService {
  private readonly logger = new Logger(SolanaVolumeStrategyService.name);

  private strategyInstances = new Map<string, StrategyInstance>();
  private connections = new Map<string, Connection>();
  private jupiterInstances = new Map<string, JupiterClient>();
  private walletPairs = new Map<string, { walletA: Wallet; walletB: Wallet }>();

  constructor(private readonly config: ConfigService) {}

  /** Generate a unique strategy key for tracking */
  private createStrategyKey(userId: string, clientId: string): string {
    const key = `solana-volume-${userId}-${clientId}`;
    return key;
  }

  /** Start a volume generation strategy */
  async startVolumeStrategy(
    config: VolumeStrategyConfig,
  ): Promise<{ strategyKey: string }> {
    const strategyKey = this.createStrategyKey(config.userId, config.clientId);
    this.logger.log(`startVolumeStrategy() called -> ${strategyKey}`);

    if (this.strategyInstances.has(strategyKey)) {
      this.logger.warn(
        `Strategy ${strategyKey} already exists; returning existing key`,
      );
      return { strategyKey };
    }

    try {
      this.logger.debug(
        `Creating Connection to ${config.rpcUrl} with commitment 'confirmed'`,
      );
      const connection = new Connection(config.rpcUrl, 'confirmed');

      this.logger.debug(`Creating Jupiter API client`);
      const jupiter = createJupiterApiClient({});

      this.logger.debug(`Loading wallets from env...`);
      const { walletA, walletB } = this.loadWalletsFromEnv();
      this.logger.log(
        `Wallets loaded. A=${walletA.publicKey.toBase58()} B=${walletB.publicKey.toBase58()}`,
      );

      this.connections.set(strategyKey, connection);
      this.jupiterInstances.set(strategyKey, jupiter);
      this.walletPairs.set(strategyKey, { walletA, walletB });

      const instance: StrategyInstance = {
        isRunning: true,
        config,
        tradesExecuted: 0,
        useWalletAAsBuyer: true,
        consecutiveErrors: 0,
      };

      this.strategyInstances.set(strategyKey, instance);

      this.logger.debug(`Checking initial balances for ${strategyKey}`);
      await this.checkBalances(strategyKey);

      this.logger.log(
        `Strategy ${strategyKey} started: mints in=${config.inputMint} out=${config.outputMint}, baseAmt=${config.baseTradeAmount}, trades=${config.numTrades}, baseInterval=${config.baseIntervalTime}s, slippageBps=${config.slippageBps}`,
      );

      // Kick off the loop
      this.logger.debug(`Kicking off executeTradingCycle for ${strategyKey}`);
      await this.executeTradingCycle(strategyKey);

      return { strategyKey };
    } catch (error: any) {
      this.logger.error(
        `startVolumeStrategy failed for ${strategyKey}: ${
          error?.message ?? error
        }`,
        error?.stack,
      );
      this.cleanupStrategy(strategyKey);
      throw error;
    }
  }

  /** Stop a running volume strategy */
  async stopVolumeStrategy(userId: string, clientId: string): Promise<void> {
    const strategyKey = this.createStrategyKey(userId, clientId);
    this.logger.warn(`Stopping strategy ${strategyKey}`);

    const instance = this.strategyInstances.get(strategyKey);
    if (!instance) {
      this.logger.warn(
        `stopVolumeStrategy: instance not found for ${strategyKey}`,
      );
      return;
    }

    instance.isRunning = false;
    if (instance.timeoutId) {
      clearTimeout(instance.timeoutId);
      this.logger.debug(`Cleared timeout for ${strategyKey}`);
    }
    this.cleanupStrategy(strategyKey);
    this.logger.log(`Strategy ${strategyKey} stopped and cleaned up`);
  }

  /** Execute trades in a loop */
  private async executeTradingCycle(strategyKey: string): Promise<void> {
    this.logger.debug(`executeTradingCycle() ENTER ${strategyKey}`);
    const instance = this.strategyInstances.get(strategyKey);
    if (!instance) {
      this.logger.warn(
        `executeTradingCycle: instance not found for ${strategyKey}`,
      );
      return;
    }
    if (!instance.isRunning) {
      this.logger.warn(
        `executeTradingCycle: ${strategyKey} is not running (exit)`,
      );
      return;
    }

    if (instance.tradesExecuted >= instance.config.numTrades) {
      this.logger.log(
        `Trade count reached (${instance.tradesExecuted}/${instance.config.numTrades}) for ${strategyKey}, stopping...`,
      );
      await this.stopVolumeStrategy(
        instance.config.userId,
        instance.config.clientId,
      );
      return;
    }

    try {
      this.logger.debug(
        `Executing trade #${
          instance.tradesExecuted + 1
        } for ${strategyKey}; buyer=${instance.useWalletAAsBuyer ? 'A' : 'B'}`,
      );
      await this.executeTrade(strategyKey);

      instance.tradesExecuted++;
      instance.useWalletAAsBuyer = !instance.useWalletAAsBuyer;
      instance.consecutiveErrors = 0;

      this.logger.log(
        `Trade #${
          instance.tradesExecuted
        } complete for ${strategyKey}; next buyer will be ${
          instance.useWalletAAsBuyer ? 'A' : 'B'
        }`,
      );

      if (instance.config.maxLossThreshold) {
        const shouldStop = await this.checkLossThreshold(strategyKey);
        this.logger.debug(
          `Loss threshold check for ${strategyKey}: shouldStop=${shouldStop}`,
        );
        if (shouldStop) {
          this.logger.warn(
            `Max loss threshold hit for ${strategyKey}, stopping strategy`,
          );
          await this.stopVolumeStrategy(
            instance.config.userId,
            instance.config.clientId,
          );
          return;
        }
      }

      const nextDelay = this.calculateNextTradeDelay(
        instance.config.baseIntervalTime,
      );
      this.logger.log(
        `Scheduling next trade for ${strategyKey} in ${nextDelay} ms (base=${instance.config.baseIntervalTime}s)`,
      );
      instance.timeoutId = setTimeout(() => {
        this.executeTradingCycle(strategyKey).catch((err) =>
          this.logger.error(
            `executeTradingCycle error (scheduled) for ${strategyKey}: ${
              err?.message ?? err
            }`,
            err?.stack,
          ),
        );
      }, nextDelay);
    } catch (error: any) {
      instance.consecutiveErrors = (instance.consecutiveErrors ?? 0) + 1;
      const base = instance.config.baseIntervalTime * 1000;
      const factor = Math.min(2 ** (instance.consecutiveErrors - 1), 8);
      const retryDelay = Math.floor(base * factor);

      this.logger.error(
        `executeTradingCycle error for ${strategyKey} (consecutiveErrors=${
          instance.consecutiveErrors
        }) -> retry in ${retryDelay} ms: ${error?.message ?? error}`,
        error?.stack,
      );

      instance.timeoutId = setTimeout(() => {
        this.executeTradingCycle(strategyKey).catch((err) =>
          this.logger.error(
            `executeTradingCycle error (retry) for ${strategyKey}: ${
              err?.message ?? err
            }`,
            err?.stack,
          ),
        );
      }, retryDelay);
    }
  }

  /** Execute one buy + sell round */
  private async executeTrade(strategyKey: string): Promise<void> {
    const instance = this.strategyInstances.get(strategyKey);
    if (!instance) throw new Error(`Strategy ${strategyKey} not found`);

    const { config, useWalletAAsBuyer } = instance;
    const jupiter = this.jupiterInstances.get(strategyKey);
    const wallets = this.walletPairs.get(strategyKey);
    if (!jupiter || !wallets)
      throw new Error(`Jupiter or wallets not ready for ${strategyKey}`);

    const buyerWallet = useWalletAAsBuyer ? wallets.walletA : wallets.walletB;
    const sellerWallet = useWalletAAsBuyer ? wallets.walletB : wallets.walletA;

    const amount = this.calculateTradeAmount(config.baseTradeAmount);
    this.logger.debug(
      `Fetching BUY quote for ${strategyKey}: in=${config.inputMint} out=${config.outputMint} amount=${amount} (atomic)`,
    );

    const buyQuote = await jupiter.quoteGet({
      inputMint: config.inputMint,
      outputMint: config.outputMint,
      amount,
      slippageBps: config.slippageBps,
    });
    if (!buyQuote) throw new Error('No buy quote available');

    this.logger.debug(
      `Executing BUY swap for ${strategyKey} as ${buyerWallet.publicKey.toBase58()} | outAmount=${
        buyQuote.outAmount
      }`,
    );
    const buySig = await this.executeSwap(strategyKey, buyerWallet, buyQuote);
    this.logger.log(`BUY tx sent for ${strategyKey}: sig=${buySig}`);

    await this.delay(1000);

    const sellAmount = parseInt(String(buyQuote.outAmount), 10);
    this.logger.debug(
      `Fetching SELL quote for ${strategyKey}: in=${config.outputMint} out=${config.inputMint} amount=${sellAmount} (atomic)`,
    );

    const sellQuote = await jupiter.quoteGet({
      inputMint: config.outputMint,
      outputMint: config.inputMint,
      amount: sellAmount,
      slippageBps: config.slippageBps,
    });
    if (!sellQuote) throw new Error('No sell quote available');

    this.logger.debug(
      `Executing SELL swap for ${strategyKey} as ${sellerWallet.publicKey.toBase58()} | outAmount=${
        sellQuote.outAmount
      }`,
    );
    const sellSig = await this.executeSwap(
      strategyKey,
      sellerWallet,
      sellQuote,
    );
    this.logger.log(`SELL tx sent for ${strategyKey}: sig=${sellSig}`);

    await this.recordTrade(
      strategyKey,
      buyQuote,
      sellQuote,
      buyerWallet.publicKey.toBase58(),
      sellerWallet.publicKey.toBase58(),
    );
    this.logger.debug(`Trade recorded for ${strategyKey}`);
  }

  /** Perform the swap using Jupiter /swap */
  private async executeSwap(
    strategyKey: string,
    wallet: Wallet,
    quote: QuoteResponse,
  ): Promise<string> {
    const connection = this.connections.get(strategyKey);
    const jupiter = this.jupiterInstances.get(strategyKey);
    if (!connection || !jupiter)
      throw new Error(`Missing connection or jupiter for ${strategyKey}`);

    this.logger.debug(
      `swapPost -> user=${wallet.publicKey.toBase58()} in=${
        (quote as any)?.inAmount
      } out=${(quote as any)?.outAmount}`,
    );

    const swapResult = await jupiter.swapPost({
      swapRequest: {
        quoteResponse: quote,
        userPublicKey: wallet.publicKey.toBase58(),
        wrapAndUnwrapSol: true,
      },
    });

    const swapTransaction = (swapResult as any)?.swapTransaction as
      | string
      | undefined;
    if (!swapTransaction)
      throw new Error('swapPost returned no swapTransaction');

    this.logger.debug(`Deserializing and signing tx for ${strategyKey}`);
    const txBytes = new Uint8Array(Buffer.from(swapTransaction, 'base64'));
    const transaction = VersionedTransaction.deserialize(txBytes);
    transaction.sign([wallet.payer]);

    const latestBlockhash = await connection.getLatestBlockhash();
    this.logger.debug(
      `Sending raw tx for ${strategyKey}; lastValidBlockHeight=${latestBlockhash.lastValidBlockHeight}`,
    );
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: true,
        maxRetries: 2,
      },
    );

    this.logger.debug(`Confirming tx ${signature} for ${strategyKey}`);
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    if (confirmation.value.err) {
      this.logger.error(
        `Transaction failed for ${strategyKey}: ${JSON.stringify(
          confirmation.value.err,
        )}`,
      );
      throw new Error(
        `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
      );
    }

    this.logger.debug(`Transaction confirmed for ${strategyKey}: ${signature}`);
    return signature;
  }

  /** Check balances (stores initial on first call) */
  private async checkBalances(strategyKey: string): Promise<void> {
    const instance = this.strategyInstances.get(strategyKey);
    const connection = this.connections.get(strategyKey);
    const wallets = this.walletPairs.get(strategyKey);
    if (!instance || !connection || !wallets) {
      this.logger.warn(
        `checkBalances aborted: missing instance/connection/wallets for ${strategyKey}`,
      );
      return;
    }

    const balanceA = await connection.getBalance(wallets.walletA.publicKey);
    const balanceB = await connection.getBalance(wallets.walletB.publicKey);
    this.logger.log(
      `Balances for ${strategyKey}: A=${wallets.walletA.publicKey.toBase58()} => ${balanceA} lamports, B=${wallets.walletB.publicKey.toBase58()} => ${balanceB} lamports`,
    );

    if (!instance.initialBalances) {
      instance.initialBalances = { walletA: balanceA, walletB: balanceB };
      this.logger.debug(`Initial balances stored for ${strategyKey}`);
    }
  }

  /** Loss threshold check */
  private async checkLossThreshold(strategyKey: string): Promise<boolean> {
    const instance = this.strategyInstances.get(strategyKey);
    const connection = this.connections.get(strategyKey);
    const wallets = this.walletPairs.get(strategyKey);
    if (
      !instance ||
      !connection ||
      !wallets ||
      !instance.config.maxLossThreshold
    ) {
      return false;
    }

    const currentBalanceA = await connection.getBalance(
      wallets.walletA.publicKey,
    );
    const currentBalanceB = await connection.getBalance(
      wallets.walletB.publicKey,
    );

    const totalCurrent = currentBalanceA + currentBalanceB;
    const totalInitial =
      (instance.initialBalances?.walletA ?? 0) +
      (instance.initialBalances?.walletB ?? 0);
    const currentLoss = (totalInitial - totalCurrent) / 1e9; // SOL

    this.logger.debug(
      `Loss check ${strategyKey}: initial=${totalInitial} current=${totalCurrent} loss=${currentLoss} SOL threshold=${instance.config.maxLossThreshold}`,
    );

    return currentLoss > instance.config.maxLossThreshold;
  }

  /** Persist trade record */
  private async recordTrade(
    strategyKey: string,
    buyQuote: QuoteResponse,
    sellQuote: QuoteResponse,
    buyerWallet: string,
    sellerWallet: string,
  ): Promise<void> {
    const instance = this.strategyInstances.get(strategyKey);
    if (!instance) return;

    const tradeData: TradeData = {
      timestamp: new Date(),
      tradeNumber: instance.tradesExecuted + 1,
      buyQuote,
      sellQuote,
      fees: this.calculateFee(buyQuote) + this.calculateFee(sellQuote),
      buyerWallet,
      sellerWallet,
    };

    this.saveTradeData(strategyKey, tradeData);
  }

  /** Best-effort fee summation */
  private calculateFee(quote: QuoteResponse): number {
    let totalFee = 0;
    try {
      const routePlan = (quote as any)?.routePlan;
      if (Array.isArray(routePlan)) {
        for (const step of routePlan) {
          const feeAmount = step?.swapInfo?.feeAmount
            ? parseInt(String(step.swapInfo.feeAmount), 10) / 1e9
            : 0;
          totalFee += Number.isFinite(feeAmount) ? feeAmount : 0;
        }
      }
    } catch {
      // ignore
    }
    return totalFee;
  }

  /** Append to JSON file */
  private saveTradeData(strategyKey: string, tradeData: TradeData): void {
    const filename = `solana_volume_${strategyKey}_trades.json`;
    let existing: TradeData[] = [];
    try {
      if (fs.existsSync(filename)) {
        existing = JSON.parse(fs.readFileSync(filename, 'utf8'));
      }
    } catch (e: any) {
      this.logger.error(
        `Failed reading existing trade data file "${filename}": ${
          e?.message ?? e
        }`,
      );
      existing = [];
    }
    existing.push(tradeData);
    try {
      fs.writeFileSync(filename, JSON.stringify(existing, null, 2));
      this.logger.debug(`Trade data appended to ${filename}`);
    } catch (e: any) {
      this.logger.error(
        `Failed writing trade data file "${filename}": ${e?.message ?? e}`,
      );
    }
  }

  /** Randomized trade amount (>= 1 atomic unit) */
  private calculateTradeAmount(baseAmount: number): number {
    const variation = 1 + (Math.random() * 0.2 - 0.1);
    const amt = Math.max(1, Math.floor(baseAmount * variation));
    this.logger.debug(`calculateTradeAmount: base=${baseAmount} -> amt=${amt}`);
    return amt;
  }

  /** Randomized delay (ms) */
  private calculateNextTradeDelay(baseDelaySeconds: number): number {
    const baseDelayMs = baseDelaySeconds * 1000;
    const variation = 1 + (Math.random() * 0.4 - 0.2);
    const delay = Math.floor(baseDelayMs * variation);
    this.logger.debug(
      `calculateNextTradeDelay: base=${baseDelaySeconds}s -> delay=${delay}ms (variation=${variation.toFixed(
        3,
      )})`,
    );
    return delay;
  }

  /** Public helpers */

  getRunningStrategies(): string[] {
    const running = Array.from(this.strategyInstances.keys()).filter(
      (key) => this.strategyInstances.get(key)?.isRunning,
    );
    this.logger.debug(`getRunningStrategies -> [${running.join(', ')}]`);
    return running;
  }

  getStrategyStatus(
    userId: string,
    clientId: string,
  ): Omit<StrategyInstance, 'config'> | undefined {
    const strategyKey = this.createStrategyKey(userId, clientId);
    const inst = this.strategyInstances.get(strategyKey);
    if (!inst) {
      this.logger.warn(`getStrategyStatus: not found ${strategyKey}`);
      return undefined;
    }
    const {
      isRunning,
      tradesExecuted,
      useWalletAAsBuyer,
      initialBalances,
      consecutiveErrors,
    } = inst;
    this.logger.debug(
      `getStrategyStatus(${strategyKey}) -> running=${isRunning} trades=${tradesExecuted} nextBuyer=${
        useWalletAAsBuyer ? 'A' : 'B'
      } errors=${consecutiveErrors}`,
    );
    return {
      isRunning,
      tradesExecuted,
      useWalletAAsBuyer,
      initialBalances,
      consecutiveErrors,
    } as any;
  }

  async getCurrentPrice(userId: string, clientId: string): Promise<number> {
    const strategyKey = this.createStrategyKey(userId, clientId);
    this.logger.debug(`getCurrentPrice() for ${strategyKey}`);

    const instance = this.strategyInstances.get(strategyKey);
    const jupiter = this.jupiterInstances.get(strategyKey);
    const connection = this.connections.get(strategyKey);
    if (!instance || !jupiter || !connection) {
      const msg = `Strategy ${strategyKey} not ready`;
      this.logger.warn(msg);
      throw new Error(msg);
    }

    const inMint = await getMint(
      connection,
      new PublicKey(instance.config.inputMint),
    );
    const outMint = await getMint(
      connection,
      new PublicKey(instance.config.outputMint),
    );

    const inDecimals = inMint.decimals;
    const outDecimals = outMint.decimals;

    const oneTokenAtomic = Math.floor(10 ** inDecimals);
    this.logger.debug(
      `Requesting quote 1 token -> atomic=${oneTokenAtomic} in=${instance.config.inputMint} out=${instance.config.outputMint}`,
    );

    const quote = await jupiter.quoteGet({
      inputMint: instance.config.inputMint,
      outputMint: instance.config.outputMint,
      amount: oneTokenAtomic,
      slippageBps: 50,
    });
    if (!quote) {
      this.logger.warn(`getCurrentPrice: no quote`);
      return 0;
    }

    const outAtomic = parseInt(String(quote.outAmount), 10);
    const price = outAtomic / Math.pow(10, outDecimals);
    this.logger.debug(
      `getCurrentPrice: outAtomic=${outAtomic} -> price=${price}`,
    );
    return price;
  }

  /** Cleanup */
  private cleanupStrategy(strategyKey: string): void {
    this.logger.debug(`cleanupStrategy for ${strategyKey}`);
    this.strategyInstances.delete(strategyKey);
    this.connections.delete(strategyKey);
    this.jupiterInstances.delete(strategyKey);
    this.walletPairs.delete(strategyKey);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  /** Load wallets from env vars SOLANA_PRIVATE_KEY_1 / SOLANA_PRIVATE_KEY_2 */
  private loadWalletsFromEnv(): { walletA: Wallet; walletB: Wallet } {
    const k1 = (
      this.config.get<string>('SOLANA_PRIVATE_KEY_1') ??
      process.env.SOLANA_PRIVATE_KEY_1
    )?.trim();
    const k2 = (
      this.config.get<string>('SOLANA_PRIVATE_KEY_2') ??
      process.env.SOLANA_PRIVATE_KEY_2
    )?.trim();

    if (!k1 || !k2) {
      throw new Error(
        'Missing SOLANA_PRIVATE_KEY_1 and/or SOLANA_PRIVATE_KEY_2 in environment',
      );
    }

    const kp1 = this.keypairFromAny(k1, 'SOLANA_PRIVATE_KEY_1');
    const kp2 = this.keypairFromAny(k2, 'SOLANA_PRIVATE_KEY_2');

    this.logger.debug(
      `Parsed keypairs: kp1.len=${kp1.secretKey?.length ?? 'n/a'} kp2.len=${
        kp2.secretKey?.length ?? 'n/a'
      }`,
    );

    return { walletA: new Wallet(kp1), walletB: new Wallet(kp2) };
  }

  /** Accept 64-byte secret key or 32-byte seed, in JSON array, base64, hex, or base58 */
  private keypairFromAny(input: string, label: string): Keypair {
    // squash accidental whitespace/newlines common in .env files
    const s = input.replace(/\s+/g, ' ').trim();

    let bytes: Uint8Array | null = null;
    let parsedVia: string | null = null;

    // 1) JSON array: "[12,34,...]"
    if (!bytes && s.startsWith('[') && s.endsWith(']')) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) {
          bytes = Uint8Array.from(arr);
          parsedVia = 'json-array';
        }
      } catch {
        /* ignore */
      }
    }

    // 2) base64
    if (!bytes) {
      try {
        const b = Buffer.from(s, 'base64');
        if (b.length === 32 || b.length === 64) {
          bytes = new Uint8Array(b);
          parsedVia = 'base64';
        }
      } catch {
        /* ignore */
      }
    }

    // 3) hex (64 hex chars = 32 bytes, 128 hex chars = 64 bytes)
    if (
      !bytes &&
      /^[0-9a-fA-F]+$/.test(s) &&
      (s.length === 64 || s.length === 128)
    ) {
      const b = Buffer.from(s, 'hex');
      bytes = new Uint8Array(b);
      parsedVia = 'hex';
    }

    // 4) base58
    if (!bytes) {
      try {
        const b = bs58.decode(s);
        if (b.length === 32 || b.length === 64) {
          bytes = b;
          parsedVia = 'base58';
        }
      } catch {
        /* ignore */
      }
    }

    // 5) fallback to your helper, if present
    if (!bytes) {
      try {
        const b = parsePrivateKeyToUint8Array(s);
        if (b?.length === 32 || b?.length === 64) {
          bytes = b;
          parsedVia = 'helper';
        }
      } catch {
        /* ignore */
      }
    }

    if (!bytes) {
      this.logger.error(
        `${label}: could not parse private key. Accepted formats: JSON [64], base64, hex, or base58 of 32 or 64 bytes.`,
      );
      throw new Error(
        `${label}: could not parse private key. Accepted formats: JSON [64], base64, hex, or base58 of 32 or 64 bytes.`,
      );
    }

    this.logger.debug(
      `${label}: parsed via=${parsedVia} length=${bytes.length} bytes`,
    );

    if (bytes.length === 64) return Keypair.fromSecretKey(bytes);
    if (bytes.length === 32) return Keypair.fromSeed(bytes);

    this.logger.error(
      `${label}: invalid key length ${bytes.length}. Expected 32 or 64 bytes.`,
    );
    throw new Error(
      `${label}: invalid key length ${bytes.length}. Expected 32 or 64 bytes.`,
    );
  }
}
