import { derived, writable, type Writable } from "svelte/store";
import { lineOptions } from "$lib/helpers/chart";
import type { Chart } from "svelte-lightweight-charts";
import type { OHLCVData, OrderBookPriceFormat, SupportedTimeFrame, TickerData } from "$lib/types/hufi/exchanges";
import { activeCoinTab } from "$lib/stores/home";
import { marketQueryFn } from "$lib/helpers/hufi/coin";
import { CoinsTypeTabs } from "$lib/helpers/constants";

// Coin
export const activeSpotTab: Writable<number> = writable(0);
export const currentCoin = writable({"id": "bitcoin","symbol": "btc","name": "Bitcoin","image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price": 42647,"market_cap": 835106968766,"market_cap_rank": 1,"fully_diluted_valuation": 895363344292,"total_volume": 12072391201,"high_24h": 42782,"low_24h": 42095,"price_change_24h": 153.96,"price_change_percentage_24h": 0.36232,"market_cap_change_24h": 3004861113,"market_cap_change_percentage_24h": 0.36112,"circulating_supply": 19586737,"total_supply": 21000000,"max_supply": 21000000,"ath": 69045,"ath_change_percentage": -38.24065,"ath_date": "2021-11-10T14:24:11.849Z","atl": 67.81,"atl_change_percentage": 62784.86453,"atl_date": "2013-07-06T00:00:00.000Z","roi": null,"last_updated": "2024-01-01T14:46:24.444Z"})
export const currentCoinChart = writable()
export const showCoinPrice = writable(true)
export const ChartPrice = writable([])
export const ChartActiveTab = writable(0)
export const ChartLineOption = writable(lineOptions)
//export const marketData = writable()
export const searchValue = writable('')

// For list sorting (change keys and 'sortCoins()' when data change)
export const asc = writable(true);
export const keys = ["market_cap_rank", "current_price", "price_change_percentage_24h"];
export const spotKeys = ["symbol", "price", "change"];
export const selectedField = writable(keys[0]);
export const spotSelectedField = writable(spotKeys[0]);

// Candle
export const CandlePair = writable<TickerData>({
  symbol: 'BTC/USDT',
  price: 0,
  exchange: 'okx',
})
export const CandlePairSearch = writable("")
export const CandlePairSelectorDialog = writable(false)
export const CandlePairSelectorLoaded = writable(false)
export const CandlePairExchangeFilter = writable("all")
// 0 Chart, 1 Overview, 2 Data, 3 Trade
export const CandleTabActive = writable(0)
// 0 OrderBook, 1 Depth, 2 Last trades
export const CandleDetailTab = writable(0)

export const CandlePriceLoaded = writable(false)
export const CandleChartLoaded = writable(false)
export const CandleOrderBookLoaded = writable(false)
export const CandleLoadingFailed = writable(false)

export const CandleChart = writable<Chart>()
export const CandleTimeRange = writable({k: '4h', v: '4h' as SupportedTimeFrame})
export const CandleTimeRangeDialog = writable(false)
export const CandleIndicatorDialog = writable(false)
export const CandleBids = writable<OrderBookPriceFormat[]>([])
export const CandleAsks = writable<OrderBookPriceFormat[]>([])
export const CandleNewData = writable<OHLCVData>()
export const CandleActiveIndicators = writable<string[]>(['MA'])

export const marketData = derived([activeCoinTab], ([$activeCoinTab], set) => {
  marketDataState.set('loading')
  const handleSuccess = (params: never[]) => {
    if (!Array.isArray(params)) {
      return;
    }
    set(params)
    marketDataState.set('success')
  };
  const handleError = () => marketDataState.set('error');
  marketQueryFn(CoinsTypeTabs[$activeCoinTab].id).then(handleSuccess).catch(handleError)
  const interval = setInterval(() => {
    marketQueryFn(CoinsTypeTabs[$activeCoinTab].id).then(handleSuccess).catch(handleError)
  }, 10000)
  return () => {
    clearInterval(interval)
  };
}, [])
export const marketDataState = writable('loading');
