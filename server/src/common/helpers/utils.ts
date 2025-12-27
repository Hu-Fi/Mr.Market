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

export const convertAssetBalancesToSymbols = (
  assetBalances: AssetBalances,
): Record<string, string> => {
  const symbolBalances: Record<string, string> = {};

  // Iterate over each entry in the asset balances
  Object.entries(assetBalances).forEach(([assetId, balance]) => {
    const symbol = 'id to symbol()'; // Find the symbol for the current asset ID
    if (symbol) {
      // If the symbol exists, add it to the result map
      symbolBalances[symbol] = balance;
    } else {
      // Optionally handle the case where there's no symbol for an asset ID
      console.warn(`Symbol not found for asset ID: ${assetId}`);
    }
  });

  return symbolBalances; // {"BTC": "0.1234", "ETH": "123"}
};

export const calculateRebalanceAmount = (
  left: BigNumber,
  right: BigNumber,
): BigNumber => {
  // Calculate total balance
  const total = left.plus(right);

  // Calculate balanced amount for each side
  const balancedAmount = total.dividedBy(2);

  // Calculate amount to transfer from right to left
  const amountToTransfer = balancedAmount.minus(left);

  return amountToTransfer;
};
