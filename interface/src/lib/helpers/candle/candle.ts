import { get } from "svelte/store";
import { fetchOHLCV } from "$lib/helpers/mrm/coin";
import { CandlePair, CandleTimeRange } from "$lib/stores/market";
import type { OHLCVData } from "$lib/types/hufi/exchanges";

export const fetchCandleChartData = async (): Promise<OHLCVData[]> => {
  const pair = get(CandlePair)
  const timeFrame = get(CandleTimeRange).v
  return fetchOHLCV(pair.exchange, pair.symbol, timeFrame)
}