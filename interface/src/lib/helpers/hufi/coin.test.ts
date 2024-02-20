import { describe, expect, it } from "vitest"
import { pairsFn, tickersFn } from "./coin"
import { SUPPORTED_PAIRS } from "../constants"

describe.skip('tickersFn', () => {
  it('Binance pairs', async () => {
    const tickers = await tickersFn('binance', SUPPORTED_PAIRS['binance'])
    expect(Object.keys(tickers).length).toBe(SUPPORTED_PAIRS['binance'].length)
  })

  it('MEXC pairs', async () => {
    const tickers = await tickersFn('mexc', SUPPORTED_PAIRS['mexc']);
    expect(Object.keys(tickers).length).toBe(SUPPORTED_PAIRS['mexc'].length);
  });

  it('Bitfinex pairs', async () => {
    const tickers = await tickersFn('bitfinex', SUPPORTED_PAIRS['bitfinex']);
    expect(Object.keys(tickers).length).toBe(SUPPORTED_PAIRS['bitfinex'].length);
  });
})

describe('pairsFn', () => {
  it('get pairs', async () => {
    const pairs = await pairsFn()
    console.log(pairs)
  })
})