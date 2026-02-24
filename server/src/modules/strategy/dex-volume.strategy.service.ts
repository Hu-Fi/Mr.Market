import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BigNumber, ethers } from 'ethers';

import { CustomLogger } from 'src/modules/logger/logger.service';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { StrategyInstance } from 'src/common/entities/strategy-instances.entity';
import { createStrategyKey } from 'src/common/helpers/strategyKey';

import { DexAdapterRegistry } from 'src/defi/adapter-registry';
import { DexVolumeStrategyDto } from './dex-volume.dto';
import { clampJitter } from 'src/defi/utils/pricing';
import { ensureAllowance, readDecimals } from 'src/defi/utils/erc20';
import { UNISWAP_V3_POOL_ABI } from 'src/defi/abis';
import { priceFromSqrtX96 } from 'src/defi/utils/pricing';

@Injectable()
export class DexVolumeStrategyService {
  private readonly logger = new CustomLogger(DexVolumeStrategyService.name);
  private loops = new Map<string, NodeJS.Timeout | null>();

  constructor(
    private readonly adapters: DexAdapterRegistry,
    @InjectRepository(MarketMakingHistory)
    private readonly orderRepo: Repository<MarketMakingHistory>,
    @InjectRepository(StrategyInstance)
    private readonly strategyRepo: Repository<StrategyInstance>,
  ) {}

  private nowUnix = () => Math.floor(Date.now() / 1000);

  async execute(dto: DexVolumeStrategyDto) {
    const {
      userId, clientId, dexId,
      chainId, rpcUrl, signerPk1, signerPk2,
      tokenIn, tokenOut, feeTier,
      baseAmountIn, amountJitterPct = 5, numCycles, baseIntervalSec, intervalJitterPct = 20,
      slippageBps, maxPriceImpactPct, maxGasCostInQuote, gasTokenPriceInQuote,
      deadlineSec = 90, dryRun = false,
    } = dto;

    const adapter = this.adapters.get(dexId);
    if (!adapter.supportsChain(chainId)) {
      throw new Error(`${dexId} not configured for chain ${chainId}`);
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, chainId);
    const signer1 = new ethers.Wallet(signerPk1, provider);
    const signer2 = signerPk2 ? new ethers.Wallet(signerPk2, provider) : null;

    const strategyKey = createStrategyKey({ type: 'dexVolume', user_id: userId, client_id: clientId });

    await this.strategyRepo.save(
      this.strategyRepo.create({
        strategyKey,
        userId,
        clientId,
        strategyType: 'dexVolume',
        parameters: dto,
        status: 'running',
        startPrice: 0,
      }),
    );

    const decIn = await readDecimals(provider, tokenIn);
    const decOut = await readDecimals(provider, tokenOut);

    const poolAddr = await adapter.getPool(provider, chainId, tokenIn, tokenOut, feeTier);
    if (poolAddr === ethers.constants.AddressZero) {
      throw new Error(`No pool for ${tokenIn}/${tokenOut} fee ${feeTier} on chain ${chainId}`);
    }

    const poolC = new ethers.Contract(poolAddr, UNISWAP_V3_POOL_ABI, provider);

    let executed = 0;
    let useAlt = false;

    const oneCycle = async () => {
      if (executed >= numCycles) {
        this.logger.log(`[${strategyKey}] Completed ${numCycles} cycles.`);
        this.loops.delete(strategyKey);
        await this.strategyRepo.update({ strategyKey }, { status: 'stopped', updatedAt: new Date() });
        return;
      }

      const signer = useAlt && signer2 ? signer2 : signer1;
      const fromAddr = await signer.getAddress();

      try {
        const slot = await poolC.slot0();
        const sqrtPriceX96 = slot[0] as BigNumber;
        const spotOutPerIn = priceFromSqrtX96(sqrtPriceX96, decIn, decOut);

        const amtInHuman = clampJitter(parseFloat(baseAmountIn), amountJitterPct);
        const amountIn = ethers.utils.parseUnits(amtInHuman.toFixed(decIn), decIn);

        // Quote A->B
        const { amountOut } = await adapter.quoteExactInputSingle(provider, chainId, {
          tokenIn, tokenOut, fee: feeTier, amountIn,
        });
        if (amountOut.lte(0)) {
          this.logger.warn(`[${strategyKey}] Quote returned 0; skipping.`);
          return scheduleNext();
        }

        const effOutPerIn =
          parseFloat(ethers.utils.formatUnits(amountOut, decOut)) /
          parseFloat(ethers.utils.formatUnits(amountIn, decIn));

        const impactPct = Math.abs((effOutPerIn - spotOutPerIn) / spotOutPerIn) * 100;
        if (impactPct > maxPriceImpactPct) {
          this.logger.warn(`[${strategyKey}] Impact ${impactPct.toFixed(4)}% > cap ${maxPriceImpactPct}%. Skip.`);
          return scheduleNext();
        }

        const minOut = amountOut.mul(10_000 - slippageBps).div(10_000);

        // Gas gate (optional)
        if (maxGasCostInQuote && gasTokenPriceInQuote) {
          const gas = await adapter.estimateGasExactInputSingle(signer, chainId, {
            tokenIn, tokenOut, fee: feeTier, recipient: fromAddr, deadline: this.nowUnix() + deadlineSec,
            amountIn, amountOutMinimum: minOut,
          });
          const feeData = await signer.provider!.getFeeData();
          const price = (feeData.maxFeePerGas ?? feeData.gasPrice) ?? BigNumber.from(0);
          const costNative = gas.mul(price);
          const costInQuote = parseFloat(ethers.utils.formatEther(costNative)) * gasTokenPriceInQuote;
          if (costInQuote > maxGasCostInQuote) {
            this.logger.warn(`[${strategyKey}] Gas ${costInQuote.toFixed(6)} > cap ${maxGasCostInQuote}. Skip.`);
            return scheduleNext();
          }
        }

        // Approvals
        if (tokenIn !== ethers.constants.AddressZero) {
          await ensureAllowance(signer, tokenIn, fromAddr, adapter.getAddresses(chainId).router, amountIn);
        }

        if (dryRun) {
          this.logger.log(`[${strategyKey}] DRY A→B: in=${amtInHuman} out≈${ethers.utils.formatUnits(amountOut, decOut)} min=${ethers.utils.formatUnits(minOut, decOut)} impact=${impactPct.toFixed(3)}%`);
        } else {
          const rcpt = await adapter.exactInputSingle(signer, chainId, {
            tokenIn, tokenOut, fee: feeTier, recipient: fromAddr, deadline: this.nowUnix() + deadlineSec,
            amountIn, amountOutMinimum: minOut,
          });

          await this.orderRepo.save(this.orderRepo.create({
            userId, clientId,
            exchange: `${dexId}:${chainId}`,
            pair: `${tokenIn}/${tokenOut}:${feeTier}`,
            side: 'buy',
            amount: parseFloat(ethers.utils.formatUnits(amountIn, decIn)),
            price: effOutPerIn,
            orderId: rcpt.transactionHash,
            executedAt: new Date(),
            status: 'closed',
            strategy: 'dexVolume',
          }));

          this.logger.log(`[${strategyKey}] Swap A→B ok: ${rcpt.transactionHash}`);
        }

        // Optional immediate B->A (bounded by available balance)
        const balOut = await new ethers.Contract(tokenOut, ['function balanceOf(address) view returns (uint256)'], provider).balanceOf(fromAddr);
        if (balOut.gt(0)) {
          const util = Math.min(1, clampJitter(1, amountJitterPct / 2));
          const amountBack = balOut.mul(Math.round(util * 10_000)).div(10_000);
          const q2 = await adapter.quoteExactInputSingle(provider, chainId, {
            tokenIn: tokenOut, tokenOut: tokenIn, fee: feeTier, amountIn: amountBack,
          });
          const minBack = q2.amountOut.mul(10_000 - slippageBps).div(10_000);

          if (!dryRun) {
            await ensureAllowance(signer, tokenOut, fromAddr, adapter.getAddresses(chainId).router, amountBack);
            const rcpt2 = await adapter.exactInputSingle(signer, chainId, {
              tokenIn: tokenOut, tokenOut: tokenIn, fee: feeTier,
              recipient: fromAddr, deadline: this.nowUnix() + deadlineSec,
              amountIn: amountBack, amountOutMinimum: minBack,
            });

            await this.orderRepo.save(this.orderRepo.create({
              userId, clientId,
              exchange: `${dexId}:${chainId}`,
              pair: `${tokenOut}/${tokenIn}:${feeTier}`,
              side: 'sell',
              amount: parseFloat(ethers.utils.formatUnits(amountBack, decOut)),
              price: 1 / (effOutPerIn || 1),
              orderId: rcpt2.transactionHash,
              executedAt: new Date(),
              status: 'closed',
              strategy: 'dexVolume',
            }));

            this.logger.log(`[${strategyKey}] Swap B→A ok: ${rcpt2.transactionHash}`);
          } else {
            this.logger.log(`[${strategyKey}] DRY B→A: in≈${ethers.utils.formatUnits(amountBack, decOut)} out(min)≈${ethers.utils.formatUnits(minBack, decIn)}`);
          }
        }

        executed++;
        useAlt = !useAlt;
        scheduleNext();
      } catch (err: any) {
        this.logger.error(`[${strategyKey}] Error: ${err?.message || err}`);
        scheduleRetry();
      }
    };

    const scheduleNext = () => {
      const delay = Math.max(1000, Math.floor(clampJitter(baseIntervalSec, intervalJitterPct) * 1000));
      const t = setTimeout(oneCycle, delay);
      this.loops.set(strategyKey, t);
      this.logger.log(`[${strategyKey}] Next hop in ~${Math.round(delay / 1000)}s`);
    };

    const scheduleRetry = () => {
      const delay = Math.floor(clampJitter(baseIntervalSec * 1.5, intervalJitterPct) * 1000);
      const t = setTimeout(oneCycle, delay);
      this.loops.set(strategyKey, t);
      this.logger.log(`[${strategyKey}] Retry in ~${Math.round(delay / 1000)}s`);
    };

    this.logger.log(`[${strategyKey}] DEX volume started on ${dexId}@${chainId}`);
    oneCycle();
  }

  stop(userId: string, clientId: string) {
    const strategyKey = createStrategyKey({ type: 'dexVolume', user_id: userId, client_id: clientId });
    const t = this.loops.get(strategyKey);
    if (t) clearTimeout(t);
    this.loops.delete(strategyKey);
    this.strategyRepo.update({ strategyKey }, { status: 'stopped', updatedAt: new Date() });
    this.logger.log(`[${strategyKey}] Stopped.`);
  }
}

