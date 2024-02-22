import { writable } from "svelte/store";
import type { PairsData } from "$lib/types/hufi/exchanges";
import { candleChartOptions, lineOptions } from "$lib/helpers/chart";

// Coin
// 0 Coins, 1 Spot, 2 Perp, 3 Options
export const activeTab = writable(0);
// 0 Favorites, 1 All, 2 MainStream, 3 Layer1, 4 Layer2, 5 Inscription, 6 AI, 7 Meme, 8 Defi, 9 GameFi, 10 NFT
export const activeSecondTab = writable(1);
export const currentCoin = writable<PairsData>({
  symbol: 'BTC/USDT',
  price: 0,
  exchange: 'binance',
})
export const currentCoinChart = writable()
export const showCoinPrice = writable(true)
export const ChartPrice = writable([])
export const ChartActiveTab = writable(0)
export const ChartLineOption = writable(lineOptions)
export const marketData = writable()
export const searchValue = writable('')

// For list sorting (change keys and 'sortCoins()' when data change)
export const asc = writable(true);
export const keys = ["market_cap_rank", "current_price", "price_change_percentage_24h"];
export const spotKeys = ["symbol", "current_price", "price_change_percentage_24h"];
export const selectedField = writable(keys[0]);

export const setActiveTab = (x: number) => {
  activeSecondTab.set(0)
  activeTab.set(x)
}

// Candle
export const CandleLoaded = writable(false)
export const CandlePair = writable<PairsData>({
  symbol: 'BTC/USDT',
  price: 0,
  exchange: 'binance',
})
export const CandlePairSearch = writable("")
export const CandlePairSelectorDialog = writable(false)
export const CandlePairSelectorLoaded = writable(false)
export const CandlePairExchangeFilter = writable("all")
// 0 Chart, 1 Overview, 2 Data, 3 Trade
export const CandleTabActive = writable(0)
export const CandleChartOptions = writable(candleChartOptions);
export const CandleTooltipData = writable({time: "2023-11-26", open: 37806.84, high: 37842.17, low: 37156.72, close: 37462.79, amount: 12370, turnover: 28220000})
// 0 OrderBook, 1 Depth, 2 Last trades
export const CandleDetailTab = writable(0)
export const CandleDetailBookDecimal = writable(1)
export const CandleDetailBookDecimalDialog = writable(false)

export const CandleChart = writable()
export const CandleTimeRange = writable(4*60*60)
export const CandleTimeRangeDialog = writable(false)
export const CandleIndicatorDialog = writable(false)

export const s = writable()