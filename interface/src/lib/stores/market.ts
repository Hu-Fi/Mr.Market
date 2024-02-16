import { writable } from "svelte/store";
import { candleChartOptions, lineOptions } from "$lib/helpers/chart";

// Coin
// 0 Coins, 1 Spot, 2 Perp, 3 Options
export const activeTab = writable(0);
// 0 Favorites, 1 All, 2 MainStream, 3 Layer1, 4 Layer2, 5 Inscription, 6 AI, 7 Meme, 8 Defi, 9 GameFi, 10 NFT
export const activeSecondTab = writable(1);
export const currentCoin = writable({"id": "bitcoin","symbol": "btc","name": "Bitcoin","image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price": 42647,"market_cap": 835106968766,"market_cap_rank": 1,"fully_diluted_valuation": 895363344292,"total_volume": 12072391201,"high_24h": 42782,"low_24h": 42095,"price_change_24h": 153.96,"price_change_percentage_24h": 0.36232,"market_cap_change_24h": 3004861113,"market_cap_change_percentage_24h": 0.36112,"circulating_supply": 19586737,"total_supply": 21000000,"max_supply": 21000000,"ath": 69045,"ath_change_percentage": -38.24065,"ath_date": "2021-11-10T14:24:11.849Z","atl": 67.81,"atl_change_percentage": 62784.86453,"atl_date": "2013-07-06T00:00:00.000Z","roi": null,"last_updated": "2024-01-01T14:46:24.444Z"});
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
export const CandlePair = writable({first: "BTC", second: "USDT", price: 43576, percentage: -0.87, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", exchange: "binance"})
export const CandlePairSearch = writable("")
export const CandlePairSelectorDialog = writable(false)
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