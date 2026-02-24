import { BigNumber, ethers } from 'ethers';
import type { DexId } from '../addresses';

export type QuoteSingleParams = {
  tokenIn: string;
  tokenOut: string;
  fee: number; // v3 fee tier (500/3000/10000)
  amountIn: BigNumber;
  sqrtPriceLimitX96?: BigNumber | number;
};

export type ExactInputSingleParams = {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountIn: BigNumber;
  amountOutMinimum: BigNumber;
  sqrtPriceLimitX96?: BigNumber | number;
};

export interface DexAdapter {
  readonly id: DexId;
  supportsChain(chainId: number): boolean;

  getAddresses(chainId: number): {
    factory: string;
    router: string;
    quoterV2: string;
    weth: string;
  };

  getPool(
    provider: ethers.providers.Provider,
    chainId: number,
    tokenIn: string,
    tokenOut: string,
    fee: number,
  ): Promise<string>;

  quoteExactInputSingle(
    provider: ethers.providers.Provider,
    chainId: number,
    p: QuoteSingleParams,
  ): Promise<{ amountOut: BigNumber }>;

  estimateGasExactInputSingle(
    signer: ethers.Signer,
    chainId: number,
    p: ExactInputSingleParams,
  ): Promise<BigNumber>;

  exactInputSingle(
    signer: ethers.Signer,
    chainId: number,
    p: ExactInputSingleParams,
  ): Promise<ethers.providers.TransactionReceipt>;
}
