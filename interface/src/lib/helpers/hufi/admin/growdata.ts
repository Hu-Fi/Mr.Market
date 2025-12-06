import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import type { ArbitragePairDto, MarketMakingPairDto, SimplyGrowTokenDto } from "$lib/types/hufi/grow";
import { getHeaders, handleApiResponse } from "$lib/helpers/hufi/common";

// Exchange Methods
export const addExchange = async (exchangeDto: Record<string, unknown>, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(exchangeDto),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error adding exchange:', error);
    throw error;
  }
};

export const getSupportedExchanges = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/supported`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting supported exchanges:', error);
    throw error;
  }
};

export const removeExchange = async (exchangeId: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/remove/${exchangeId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing exchange:', error);
    throw error;
  }
};

export const removeAllExchanges = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/remove-all`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing all exchanges:', error);
    throw error;
  }
};

export const updateExchange = async (exchangeId: string, modifications: Record<string, unknown>, token: string): Promise<string> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/update/${exchangeId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(modifications),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    return 'ok';
  } catch (error) {
    console.error('Error updating exchange:', error);
    throw error;
  }
};

// SimplyGrow Token Methods
export const addSimplyGrowToken = async (tokenDto: SimplyGrowTokenDto, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/simply-grow/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(tokenDto),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error adding SimplyGrow token:', error);
    throw error;
  }
};

export const removeSimplyGrowToken = async (assetId: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/simply-grow/remove/${assetId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing SimplyGrow token:', error);
    throw error;
  }
};

export const removeAllSimplyGrowTokens = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/simply-grow/remove-all`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing all SimplyGrow tokens:', error);
    throw error;
  }
};

export const updateSimplyGrowToken = async (assetId: string, modifications: SimplyGrowTokenDto, token: string): Promise<string> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/simply-grow/update/${assetId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(modifications),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    return 'ok';
  } catch (error) {
    console.error('Error updating SimplyGrow token:', error);
    throw error;
  }
};

// Market Making Pair Methods
export const addMarketMakingPair = async (pairDto: MarketMakingPairDto, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/market-making/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(pairDto),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error adding market making pair:', error);
    throw error;
  }
};

export const removeMarketMakingPair = async (id: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/market-making/remove/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing market making pair:', error);
    throw error;
  }
};

export const removeAllMarketMakingPairs = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/market-making/remove-all`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing all market making pairs:', error);
    throw error;
  }
};

export const updateMarketMakingPair = async (id: string, modifications: Partial<MarketMakingPairDto>, token: string): Promise<string> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/market-making/update/${id}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(modifications),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    return 'ok';
  } catch (error) {
    console.error('Error updating market making pair:', error);
    throw error;
  }
};

// Arbitrage Pair Methods
export const addArbitragePair = async (pairDto: ArbitragePairDto, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/arbitrage/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(pairDto),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error adding arbitrage pair:', error);
    throw error;
  }
};

export const removeArbitragePair = async (id: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/arbitrage/remove/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing arbitrage pair:', error);
    throw error;
  }
};

export const removeAllArbitragePairs = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/arbitrage/remove-all`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error removing all arbitrage pairs:', error);
    throw error;
  }
};

export const updateArbitragePair = async (id: string, modifications: ArbitragePairDto, token: string): Promise<string> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/arbitrage/update/${id}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(modifications),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    return 'ok';
  } catch (error) {
    console.error('Error updating arbitrage pair:', error);
    throw error;
  }
};


// CCXT Methods
export const getAllCcxtExchanges = async (token: string): Promise<string[]> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/ccxt-supported`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting all CCXT exchanges:', error);
    throw error;
  }
};

export const getCcxtExchangeDetails = async (exchangeId: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/details/${exchangeId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting CCXT exchange details:', error);
    throw error;
  }
};

export const getCcxtExchangeMarkets = async (exchangeId: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/grow/exchange/markets/${exchangeId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error getting CCXT exchange markets:', error);
    throw error;
  }
};
