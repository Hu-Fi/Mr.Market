import { describe, it, expect, vi } from 'vitest';
import { getCurrencyRate } from './currency';

vi.mock('$env/dynamic/public', () => {
  return {
    env: {}
  };
});

describe('getCurrencyRate', () => {
  it('should return filtered currency rates', async () => {
    const currencies = ['AED', 'EUR'];
    const result = await getCurrencyRate(currencies);

    expect(result).toHaveProperty('AED');
    expect(result).toHaveProperty('EUR');
  });

  it('should return an empty object if no currencies match', async () => {
    const currencies = ['SB', 'XD'];
    const result = await getCurrencyRate(currencies);

    expect(result).toEqual({});
  });

  it('should handle case insensitivity', async () => {
    const currencies = ['aed', 'eur', 'afn'];
    const result = await getCurrencyRate(currencies);
    expect(result).toHaveProperty('AED');
    expect(result).toHaveProperty('EUR');
    expect(result).toHaveProperty('AFN');
  });
});
