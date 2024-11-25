import { PAIRS_MAP } from 'src/common/constants/pairs';
import { PairsMapKey } from 'src/common/types/pairs/pairs';
import {
  generateRandomSequence,
  getPairSymbolByKey,
} from 'src/common/helpers/utils';

describe('generateRandomSequence', () => {
  it('random 4 positions word', () => {
    for (let i = 0; i < 10; i++) {
      const v = generateRandomSequence();
      expect(v.length).toBe(4);
    }
  });
});

describe('getPairSymbolByKey', () => {
  it('get symbol by key', () => {
    const keys = Object.keys(PAIRS_MAP);
    keys.forEach((k: PairsMapKey) => {
      const symbol = getPairSymbolByKey(k);
      expect(symbol).toBe(PAIRS_MAP[k]);
    });
  });

  it('get no key', () => {
    // @ts-expect-error on purpose
    expect(getPairSymbolByKey('WTF')).toBe('');
  });
});
