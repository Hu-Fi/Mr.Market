import { get } from "svelte/store";
import { fetchOHLCV } from "$lib/helpers/hufi/coin";
import { CandlePair, CandleTimeRange } from "$lib/stores/market";
import type { OHLCVData } from "$lib/types/hufi/exchanges";

export const fetchCandleChartData = async (): Promise<OHLCVData[]> => {
  const pair = get(CandlePair)
  console.log('fetchCandleChartData', pair)

  const timeFrame = get(CandleTimeRange).v

  console.log('fetchCandleChartData', pair.exchange_id, pair.symbol, timeFrame)
  return fetchOHLCV(pair.exchange_id, pair.symbol, timeFrame)
}