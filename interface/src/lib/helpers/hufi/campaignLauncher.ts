import { HUFI_CAMPAGIN_LAUNCHER_URL } from "$lib/helpers/constants";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getActiveCampaigns = async (chain_id: 1 | 137 = 137, launcher?: string, status: 'active'| 'cancelled'| 'completed' = 'active', limit: number = 10, skip: number = 0) => {
  try {
    const response = await fetch(`${HUFI_CAMPAGIN_LAUNCHER_URL}/campaigns?chain_id=${chain_id}&launcher=${launcher || ''}&status=${status}&limit=${limit}&skip=${skip}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
  }
}

export const getSupportedExchanges = async () => {
  try {
    const response = await fetch(`${HUFI_CAMPAGIN_LAUNCHER_URL}/exchanges`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported exchanges:', error);
  }
}

// bigone, binance, bybit, gate, htx, kraken, mexc, upbit, xt (2025-11-04)
export const getSupportedPairs = async (exchange: string) => {
  try {
    const response = await fetch(`${HUFI_CAMPAGIN_LAUNCHER_URL}/exchanges/${exchange}/trading-pairs`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported pairs:', error);
  }
}

export const getSupportedCurrencies = async (exchange: string) => {
  try {
    const response = await fetch(`${HUFI_CAMPAGIN_LAUNCHER_URL}/exchanges/${exchange}/currencies`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
  }
}