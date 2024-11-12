import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrencyRate } from './currency';

vi.mock('$env/dynamic/public', () => {
  return {
    env: {}
  };
});

beforeEach(() => {
  vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        usd: {
          AED: 3.6725,
          AFN: 67.98694366,
          USD: 1,
          EUR: 0.93252508,
        }
      }),
    })
  );
});

describe('getCurrencyRate', () => {
  it('should return filtered currency rates', async () => {
    const currencies = ['AED', 'EUR'];
    const result = await getCurrencyRate(currencies);

    expect(result).toEqual({
      AED: 3.6725,
      EUR: 0.93252508,
    });
  });

  it('should return an empty object if no currencies match', async () => {
    const currencies = ['SB', 'XD'];
    const result = await getCurrencyRate(currencies);

    expect(result).toEqual({});
  });

  it('should handle case insensitivity', async () => {
    const currencies = ['aed', 'eur', 'afn'];
    const result = await getCurrencyRate(currencies);
    expect(result).toEqual({
      AED: 3.6725,
      EUR: 0.93252508,
      AFN: 67.98694366,
    });
  });
});
