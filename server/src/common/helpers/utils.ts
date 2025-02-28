import BigNumber from 'bignumber.js';
import { SYMBOL_ASSET_ID_MAP } from 'src/common/constants/pairs';

export const getAssetIDBySymbol = (value: string) => {
  const symbol = value.split('/');
  const base = symbol[0];
  const target = symbol[1];
  const baseAssetID = SYMBOL_ASSET_ID_MAP[base];
  const targetAssetID = SYMBOL_ASSET_ID_MAP[target];
  return {
    baseAssetID,
    targetAssetID,
  };
};

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
