import { HUFI_BACKEND_URL, SUPPORTED_JUST_GROW_TOKENS } from "$lib/helpers/constants";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// This is the unified endpoint for all 'grow' realted actions, including arbitrage, market making and just grow. Also auto invest in the future.
export const getGrowBasicInfo = async () => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/grow/basic`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching grow basic info:', error);
  }
}

export const getSupportedJustGrowTokens = async () => {
  try {
    // const response = await fetch(`${HUFI_BACKEND_URL}/grow/just_grow/supported_tokens`);
    return SUPPORTED_JUST_GROW_TOKENS;
    // return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported tokens for just grow:', error);
  }
}

export const getSupportedArbitrageExchanges = async () => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/grow/arbitrage/supported_exchanges`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported exchanges for arbitrage:', error);
  }
}

export const getSupportedMarketMakingPairs = async () => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/grow/market_making/supported_pairs`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching supported pairs for market making:', error);
  }
}