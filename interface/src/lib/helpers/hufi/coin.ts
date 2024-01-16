// Hufi backend

import { HUFI_BACKEND_URL } from "../constants";
import { formatDecimals } from "../utils";

// {/coingecko/coins/:id, GET}
// {/coingecko/coins/markets/:vs_currency, GET}
// {/coingecko/coins/:id/market_chart, GET}
// {/coingecko/coins/:id/market_chart/range, GET}

export const coinQueryFn = async (name: string) =>  {
  const r = await fetch(`${HUFI_BACKEND_URL}/coingecko/coins/${name}`)
  const re = await r.json()
  console.log(re)
  return re
}

export const marketQueryFn = async () =>  {
  try {
    const r = await fetch(`${HUFI_BACKEND_URL}/coingecko/coins/markets/${'usd'}?limit`)
    const re = await r.json()
    return re
  } catch (e) {
    window.location.reload()
  }
}

export const coinMarketChart = async (name: string, ranges: '1h'|'24h'|'1w'|'1m'|'1y'|'all', vs_currency: string = 'usd') => {
  let url = ''; let days: number | string
  
  switch (ranges) {
    case '1h': 
      const currentTs = Math.floor(new Date().setSeconds(0, 0) / 1000);
      const oneHourBefore = currentTs - 3600;
      url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart/range?from=${oneHourBefore}&to=${currentTs}&vs_currency=${vs_currency}`
      break;
    case "24h": days=1; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1w": days=7; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1m": days=30; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "1y": days=365; url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
    case "all": days='max';url = `${HUFI_BACKEND_URL}/coingecko/coins/${name}/market_chart?days=${days}&vs_currency=${vs_currency}`; break;
  }
  console.log('final_url: ',url)

  const r = await fetch(url)
  const re = await r.json()
  console.log('market chart',re)
  return re
}

export const formatMarketChartAPI = (arr:[]) => {
  if (arr) return arr.map(([time, value]) => ({ time: time, value: formatDecimals(value, 2) }))
  return arr
}