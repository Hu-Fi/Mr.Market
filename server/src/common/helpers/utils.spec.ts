import { PAIRS_MAP } from '../constants/pairs';
import { PairsMapKey } from '../types/pairs/pairs';
import { generateRandomSequence, getPairSymbolByKey } from './utils';

describe('generateRandomSequence', () => {
  it('random 4 positions word', () => {
    for (let i = 0; i < 10; i++) {
      const v = generateRandomSequence();
      console.log(v);
      expect(v.length).toBe(4);
    }
  });
});

describe('getPairSymbolByKey', () => {
  it('get symbol by key', () => {
    const keys = Object.keys(PAIRS_MAP);
    keys.forEach((k: PairsMapKey) => {
      const symbol = getPairSymbolByKey(k);
      console.log(symbol);
      expect(symbol).toBe(PAIRS_MAP[k]);
    });
  });

  it('get no key', () => {
    // @ts-expect-error on purpose
    expect(getPairSymbolByKey('WTF')).toBe('');
  });
});
