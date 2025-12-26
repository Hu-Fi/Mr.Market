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
  symbol?: string;
  base_asset_id: string;
  quote_asset_id: string;
  base_fee_id: string;
  quote_fee_id: string;
  base_fee_amount: string;
  quote_fee_amount: string;
  base_fee_symbol?: string;
  quote_fee_symbol?: string;
  base_fee_price_usd?: string;
  quote_fee_price_usd?: string;
  base_asset_price_usd?: string;
  quote_asset_price_usd?: string;
  market_making_fee_percentage?: string;
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