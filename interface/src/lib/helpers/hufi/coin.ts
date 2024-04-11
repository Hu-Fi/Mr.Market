// Hufi backend
import { error } from "console";
import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import type { OHLCVData, SupportedExchanges, SupportedPairs, SupportedTimeFrame, TokenChartTimeFrame } from "$lib/types/hufi/exchanges";
import type { CoingeckoTokenFull } from "$lib/types/coingecko/token";

// {/coingecko/coins/:id, GET}
// {/coingecko/coins/markets/:vs_currency, GET}
// {/coingecko/coins/:id/market_chart, GET}
// {/coingecko/coins/:id/market_chart/range, GET}

export const coinQueryFn = async (name: string): Promise<CoingeckoTokenFull> =>  {
  const r = await fetch(`${HUFI_BACKEND_URL}/coingecko/coins/${name}`)
  return await r.json()
}

export const marketQueryFn = async (category: string) =>  {
  try {
    const pathCategory = category ? `/category/${category}` : ''
    const r = await fetch(`${HUFI_BACKEND_URL}/coingecko/coins/markets/${'usd'}${pathCategory}?limit`)
    const re = await r.json()
    return re
  } catch (e) {
    console.error('Server error')
    return []
  }
}

export const pairsFn = async () => {
  try {
    const r = await fetch(`${HUFI_BACKEND_URL}/marketdata/tickers/pairs`)
    const re = await r.json()
    return re
  } catch (e) {
    throw error('pairsFn:', e)
  }
}

export const fetchOHLCV = async (exchange: SupportedExchanges, symbol: SupportedPairs, timeFrame: SupportedTimeFrame, limit: number = 2000): OHLCVData[] => {
  const r = await fetch(`${HUFI_BACKEND_URL}/marketdata/ohlcv?exchange=${exchange}&symbol=${symbol}&timeframe=${timeFrame}&limit=${limit}`)
  if (!r.ok) {
    console.error(`fetchOHLCV failed with status: ${r.status}`)
    return [];
  }
  const re = await r.json()
  return re
}

export const coinMarketChart = async (name: string, ranges: TokenChartTimeFrame, vs_currency: string = 'usd') => {
  let url = ''; let days: number | string

  const currentTs = Math.floor(new Date().setSeconds(0, 0) / 1000);
  const oneHourBefore = currentTs - 3600;
  switch (ranges) {
    case '1h':
      url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart/range?from=${oneHourBefore}&to=${currentTs}&vs_currency=${vs_currency}`
      break;
    case "24h": days=1; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1w": days=7; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1m": days=30; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1y": days=365; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "all": days='max';url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
  }

  const r = await fetch(url)
  return  await r.json()
}