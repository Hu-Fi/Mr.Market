import {
  PairsMapKey,
  PairsMapValue,
  SymbolAssetIdMapKey,
  SymbolAssetIdMapValue,
} from 'src/common/types/pairs/pairs';
import BigNumber from 'bignumber.js';
import { ExchangeIndex } from 'src/common/types/memo/memo';
import { SPOT_EXCHANGE_MAP } from 'src/common/constants/memo';
import { PAIRS_MAP, SYMBOL_ASSET_ID_MAP } from 'src/common/constants/pairs';

// used for generating 4 positions key mapped to trading symbol
export const generateRandomSequence = () => {
  // Helper function to generate a random letter
  function getRandomLetter(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  // Helper function to generate a random digit
  function getRandomDigit(): string {
    return Math.floor(Math.random() * 10).toString();
  }

  // Generate a 4-character sequence
  let sequence = '';
  for (let i = 0; i < 4; i++) {
    // Randomly choose to add a letter or a digit
    const isLetter = i === 0 ? true : Math.random() > 0.5; // Randomly choose between letter and digit
    sequence += isLetter ? getRandomLetter() : getRandomDigit();
  }

  return sequence;
};

export const getPairSymbolByKey = (key: PairsMapKey): PairsMapValue => {
  return PAIRS_MAP[key] || '';
};

export const getExchangeNameByIndex = (index: ExchangeIndex) => {
  return SPOT_EXCHANGE_MAP[index] || '';
};

export const getAssetIDBySymbol = (value: PairsMapValue) => {
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

export const getSymbolByAssetID = (
  asset_id: SymbolAssetIdMapValue,
): SymbolAssetIdMapKey => {
  return SYMBOL_ASSET_ID_MAP[asset_id] || '';
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
