import { Connection } from '@solana/web3.js';
import { QuoteResponse } from '@jup-ag/api';

export interface VolumeStrategyConfig {
  userId: string;
  clientId: string;
  rpcUrl: string;
  inputMint: string;   // SPL mint address
  outputMint: string;  // SPL mint address
  baseTradeAmount: number; // atomic units of input mint
  numTrades: number;
  baseIntervalTime: number; // seconds
  slippageBps: number; // e.g. 50 = 0.5%
  pricePushRate: number; // reserved
  maxLossThreshold?: number; // in SOL
}

export interface StrategyInstance {
  isRunning: boolean;
  timeoutId?: NodeJS.Timeout;
  config: VolumeStrategyConfig;
  tradesExecuted: number;
  useWalletAAsBuyer: boolean;
  initialBalances?: {
    walletA: number; // lamports
    walletB: number; // lamports
  };
  consecutiveErrors?: number;
}

export interface TradeData {
  timestamp: Date;
  tradeNumber: number;
  buyQuote: QuoteResponse;
  sellQuote: QuoteResponse;
  fees: number;
  buyerWallet: string;   // base58
  sellerWallet: string;  // base58
  pnl?: number;
}
