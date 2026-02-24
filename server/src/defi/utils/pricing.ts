import { BigNumber } from 'ethers';

export function priceFromSqrtX96(
  sqrtPriceX96: BigNumber,
  token0Decimals: number,
  token1Decimals: number,
): number {
  const TWO_96 = BigNumber.from(2).pow(96);
  const num = sqrtPriceX96.mul(sqrtPriceX96);
  const base = num.mul(BigNumber.from(10).pow(token0Decimals));
  const denom = TWO_96.mul(TWO_96).mul(BigNumber.from(10).pow(token1Decimals));
  return parseFloat(base.mul(1_000_000).div(denom).toString()) / 1_000_000;
}

export function pctToBps(pct: number) {
  return Math.round(pct * 100);
}

export function clampJitter(base: number, jitterPct: number) {
  const r = (Math.random() * 2 - 1) * (jitterPct / 100);
  return base * (1 + r);
}
