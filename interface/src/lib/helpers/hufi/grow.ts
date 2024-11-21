import { HUFI_BACKEND_URL, SUPPORTED_ARBITRAGE_PAIRS } from "$lib/helpers/constants";
import type { GrowInfo } from "$lib/types/hufi/grow";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getGrowBasicInfo = async (): Promise<GrowInfo> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/grow/info`)
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching grow basic info:', error);
  }
  return {} as GrowInfo;
}

export const getSupportedArbitragePairs = () => {
  return SUPPORTED_ARBITRAGE_PAIRS;
}

export const getSupportedMarketMakingPairs = async () => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/grow/market_making/supported_pairs`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported pairs for market making:', error);
  }
}