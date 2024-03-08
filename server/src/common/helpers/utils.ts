import { PAIRS_MAP, SYMBOL_ASSET_ID_MAP } from '../constants/pairs';
import { PairsMapKey, PairsMapValue } from '../types/pairs/pairs';

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

export const getPairSymbolByKey = (key: PairsMapKey) => {
  return PAIRS_MAP[key] || '';
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
