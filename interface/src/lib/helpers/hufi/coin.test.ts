import { describe, it, vi } from "vitest"
import { fetchOHLCV, pairsFn } from "./coin"
import type { SupportedExchanges } from "$lib/types/hufi/exchanges"
import { SUPPORTED_TIMERANGES } from "$lib/helpers/constants"

vi.mock('$env/dynamic/public', () => {
  return {
    env: {}
  };
});

describe.skip('pairsFn', () => {
  it('get pairs', async () => {
    const pairs = await pairsFn()
    console.log(pairs)
  })
})

describe.skip('fetchOHLCV', () => {
  const exchanges: SupportedExchanges[] = ['bitfinex', 'mexc']
  for (let x=0; x<exchanges.length; x++) {
    const exchange = exchanges[x]
    describe(`${exchange} BTC/USDT`, async () => {
      for (let i=0; i<SUPPORTED_TIMERANGES.length; i++) {
        it(`${SUPPORTED_TIMERANGES[i]}`, async () => {
          const OHLCV = await fetchOHLCV(exchange, 'BTC/USDT', SUPPORTED_TIMERANGES[i]);
          if (!OHLCV.length) throw Error(`${exchange} doesn't support ${SUPPORTED_TIMERANGES[i]}`)
          // console.log(SUPPORTED_TIMERANGES[i], OHLCV.length)
        })
      }
    })
  }
})