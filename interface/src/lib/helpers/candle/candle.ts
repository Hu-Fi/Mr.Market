import { get } from "svelte/store";
import { fetchOHLCV } from "$lib/helpers/hufi/coin";
import { CandlePair, CandleTimeRange } from "$lib/stores/market";
import type { CandleTab, OHLCVData } from "$lib/types/hufi/exchanges";

export const fetchCandleChartData = async (): Promise<OHLCVData[]> => {
  const pair = get(CandlePair)
  const timeFrame = get(CandleTimeRange).v
  return fetchOHLCV(pair.exchange, pair.symbol, timeFrame)
}

export const setCandleTimeFrame = async (timeFrame: CandleTab) => {
  CandleTimeRange.set(timeFrame);
  return await fetchCandleChartData();
}