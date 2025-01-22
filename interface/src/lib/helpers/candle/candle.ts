import { get } from "svelte/store";
import { fetchOHLCV } from "$lib/helpers/hufi/coin";
import { CandlePair, CandleTimeRange } from "$lib/stores/market";
import type { OHLCVData } from "$lib/types/hufi/exchanges";

export const fetchCandleChartData = async (): Promise<OHLCVData[]> => {
  const pair = get(CandlePair)

  if (!pair.exchange_id) {
    throw new Error('Exchange ID is required');
  }

  if (!pair.symbol) {
    throw new Error('Symbol is required');
  }

  const timeFrame = get(CandleTimeRange).v

  return fetchOHLCV(pair.exchange_id, pair.symbol, timeFrame)
}