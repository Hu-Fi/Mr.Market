import { describe, expect, it } from 'vitest'
import { formatChartPrice, formatDecimals, formatTimestampToTime, formatWalletBalance } from './utils'

describe('formatTimestampToTime', () => {
  it('format YYYY-MM-DD', () => {
    expect(formatTimestampToTime('2018-10-19')).toBe('2018-10-19')
  })

  it('format RFC3339', ()=> {
    expect(formatTimestampToTime('2018-10-19T09:23:21Z')).toBe('2018-10-19')
  })

  it.fails('format unix timestamp', ()=> {
    expect(formatTimestampToTime(1705350248)).toBe('')
  })
})

describe('formatDecimals', () => {
  it.each([
    [0.00000001, 0, 0],
    [0.00000001, 2, 0.00],
    [0.00000001, 4, 0.0000],
    [0.00000001, 8, 0.00000001],

    [0.023, 2, 0.02],

    [1.235, 1, 1.2],
    [1.235, 2, 1.23],
    [1.235, 3, 1.235],
    [1.235, 4, 1.235],

    [123.123456789, 3, 123.123],
    [123.123456789, 4, 123.1234],
    [123.123456789, 5, 123.12345],
    [123.123456789, 6, 123.123456],
    [123.123456789, 7, 123.1234567],
    [123.123456789, 8, 123.12345678],
  ])('formats all type of decimals', (input, precision, expected) => {
    expect(formatDecimals(input, precision)).toBe(expected);
  });
});

describe('formatChartPrice', () => {
  it.each([
    [0.00001, 0.00001],
    [0.000001, 0.000001],
    // FIX
    // [0.0000001, 0.0000001],
    // [0.00000001, 0.00000001],
    [0.0123, 0.0123],
    [0.00123, 0.00123],
    [0.000123, 0.000123],
    [0.0000123, 0.0000123],
    [0.00000123, 0.00000123],
    [0.000000123, 0.000000123],
    [0.0000000123, 0.0000000123],

    ])('when 0.00000001 < x < 0.1, return all decimal places', (input, expected) => {
    expect(formatChartPrice(input)).toBe(expected);
  });

  it.each([
    [0.1, 0.1],
    [0.12, 0.12],
    [0.123, 0.123],
    [0.1234, 0.1234],
    [0.12345, 0.12345],
    [0.123456, 0.123456],
    [0.1234567, 0.1234567],
    [0.12345678, 0.12345678],
    [0.123456789, 0.123456789],
    [0.1234567890, 0.1234567890],
  ])('when 0.1 < x < 0.1, return all decimal places', (input, expected) => {
    expect(formatChartPrice(input)).toBe(expected);
  });

  it.each([
    [1.23, 1.23],
    [1.235, 1.235],
    [1.2356, 1.2356],
    [1.23567, 1.23567],
  ])('when 1 <= x < 10, return all decimal places', (input, expected) => {
    expect(formatChartPrice(input)).toBe(expected);
  });

  it.each([
    [12.1, 12.1],
    [12.12, 12.12],
    [12.123, 12.123],
    [12.1234, 12.123],
    [12.12345, 12.123],
    [12.123456, 12.123],
    [12.1234567, 12.123],
    [12.12345678, 12.123],
    [12.123456789, 12.123],
    [12.1234567890, 12.123],
  ])('when 10 <= x < 100, return 3 decimal places', (input, expected) => {
    expect(formatChartPrice(input)).toBe(expected);
  });

  it.each([
    [123.1, 123.1],
    [123.12, 123.12],
    [123.123, 123.12],
    [123.1234, 123.12],
    [123.12345, 123.12],
    [123.123456, 123.12],
    [123.1234567, 123.12],
    [123.12345678, 123.12],
    [123.123456789, 123.12],
    [123.1234567890, 123.12],
  ])('when x >= 100, return 2 decimal places', (input, expected) => {
    expect(formatChartPrice(input)).toBe(expected);
  });
});

describe('formatWalletBalance', () => {
  it.each([
    [0.00001, 0.00001],
    [0.0000001, 0.0000001],
    [0.00000001, 0.00000001],
    [0.000000001, 0.000000001],
    
    [0.123456, 0.123456],
    [0.1234567, 0.1234567],
    [0.12345678, 0.1234567],
    [0.123456789, 0.12345678],

    [1.123456, 1.123456],
    [1.1234567, 1.1234567],
    [1.12345678, 1.1234567],
    [1.123456789, 1.1234567],
  ])('show all decimal places when small value', (input, expected) => {
    expect(formatWalletBalance(input)).toBe(expected);
  });

  it.each([
    [123.1, 123.1],
    [123.12, 123.12],
    [123.123, 123.123],
    [123.1234, 123.1234],
    [123.12345, 123.12345],
    [123.123456, 123.12345],
    [123.1234567, 123.12345],
    [123.12345678, 123.12345],
    [123.123456789, 123.12345],
    [123.1234567890, 123.12345],
  ])('show 8 total places when medium value', (input, expected) => {
    expect(formatWalletBalance(input)).toBe(expected);
  });

  it.each([
    [12345678.1, 12345678],
    [12345678.12, 12345678],
  ])('show 0 decimal places when large value', (input, expected) => {
    expect(formatWalletBalance(input)).toBe(expected);
  });
})

describe('', () => {
  
})