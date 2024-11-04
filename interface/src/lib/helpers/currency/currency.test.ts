import { describe, expect, it, vi } from 'vitest'
import { formatRequestPairs, parseUSDFiatRate, parseUSDTUSDRate } from './currency';
import { BALANCE_CURRENCIES } from '../constants';
import type { ChainLinkResponseData } from '$lib/types/currency/currency';

vi.mock('$env/dynamic/public', () => {
    return {
      env: {
        AppURL: '',
      }
    }
  });

global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => {}
});

describe('formatRequestPairs', () => {
    it('should filter out "USDT" and map "USD" to each remaining currency', () => {
        const expectedOutput = 'USDEUR,USDGBP,USDAED,USDCNY,USDHKD,USDJPY';
        const result = formatRequestPairs(BALANCE_CURRENCIES)
        expect(result).toBe(expectedOutput);
    });

    it('should return an empty string if all currencies are "USDT"', () => {
        const input = ['USDT', 'USDT'];
        const expectedOutput = '';
        expect(formatRequestPairs(input)).toBe(expectedOutput);
    });

    it('should return an empty string if all currencies are "USD"', () => {
        const input = ['USD', 'USD'];
        const expectedOutput = '';
        expect(formatRequestPairs(input)).toBe(expectedOutput);
    });

    it('should handle an empty array', () => {
        const input: string[] = [];
        const expectedOutput = '';
        expect(formatRequestPairs(input)).toBe(expectedOutput);
    });

    it('should handle an array with no "USDT"', () => {
        const input = ['EUR', 'JPY', 'GBP'];
        const expectedOutput = 'USDEUR,USDJPY,USDGBP';
        expect(formatRequestPairs(input)).toBe(expectedOutput);
    });
});

// Test for parseUSDFiatRate
describe('parseUSDFiatRate', () => {
    it('should parse and return the USD fiat rates', () => {
        const input = [
            {
                ccyPair: "USDJPY",
                latest: {
                    open: 151.6
                }
            }
        ];
        const result = parseUSDFiatRate(input);
        expect(result).toEqual({ JPY: 151.6 });
    });
});

// Test for parseUSDTUSDRate
describe('parseUSDTUSDRate', () => {
    it('should parse and return the USDT/USD rate', () => {
        const input = {
            data: {
                chainData: {
                    nodes: [{ inputs: { answer: 99921000 } }]
                }
            }
        }
        const result = parseUSDTUSDRate(input);
        expect(result).toEqual(0.99921);
    });

    it('should return null for invalid data format', () => {
        const input = {
            data: {
                error: '500 Internal Server Error'
            }
        }
        const result = parseUSDTUSDRate(input);
        expect(result).toBeNull();
    });

    it('should return null for missing data', () => {
        const input = {};
        const result = parseUSDTUSDRate(input as ChainLinkResponseData);
        expect(result).toBeNull();
    });
})