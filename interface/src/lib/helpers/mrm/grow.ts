import { MRM_BACKEND_URL } from "$lib/helpers/constants";
import type { GrowInfo } from "$lib/types/hufi/grow";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getGrowBasicInfo = async (): Promise<GrowInfo> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/grow/info`)
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching grow basic info:', error);
  }
  return {} as GrowInfo;
}

export interface MarketMakingFee {
  base_asset_id: string;
  quote_asset_id: string;
  base_fee_id: string;
  quote_fee_id: string;
  base_asset_fee: string;
  quote_asset_fee: string;
  creation_fee: string;
  creation_fee_asset_id: string;
  creation_fee_symbol: string;
  direction: string;
}

export const getMarketMakingFee = async (
  exchange: string,
  pair: string,
  direction: 'deposit_to_exchange' | 'withdraw_from_exchange' = 'deposit_to_exchange'
): Promise<MarketMakingFee | null> => {
  try {
    const encodedPair = encodeURIComponent(pair);
    const url = `${MRM_BACKEND_URL}/fees/market-making/fee?exchange=${exchange}&pair=${encodedPair}&direction=${direction}`;
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching market making fee:', error);
    return null;
  }
}