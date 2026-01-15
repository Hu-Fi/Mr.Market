import BigNumber from 'bignumber.js';
import { AssetBalances } from 'src/common/types/rebalance/map';

export const getRFC3339Timestamp = () => {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  const msFromEpochWithOffset = now.getTime() - offsetMs;
  const isoString = new Date(msFromEpochWithOffset).toISOString();
  return isoString.slice(0, -1) + 'Z';
};

export const subtractFee = (
  amount: string,
  feePercentage: string,
): { amount: string; fee: string } => {
  const amountBN = new BigNumber(amount);
  const feePercentageBN = new BigNumber(feePercentage);

  const feeAmount = amountBN.multipliedBy(feePercentageBN);
  const finalAmount = amountBN.minus(feeAmount);

  return {
    amount: finalAmount.toString(),
    fee: feeAmount.toString(),
  };
};