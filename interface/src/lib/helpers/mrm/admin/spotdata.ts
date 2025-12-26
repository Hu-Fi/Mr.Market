import { MRM_BACKEND_URL } from "$lib/helpers/constants";
import type { SpotTradingPair } from "$lib/types/hufi/spot";
import { getHeaders, handleApiResponse } from "$lib/helpers/mrm/common";

// Add a new spot trading pair
export const addSpotTradingPair = async (pair: SpotTradingPair, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/admin/spot/trading-pair/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(pair),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error adding spot trading pair:', error);
    throw error;
  }
}

// Update an existing spot trading pair
export const updateSpotTradingPair = async (id: string, modifications: Partial<SpotTradingPair>, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/admin/spot/trading-pair/update/${id}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(modifications),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error updating spot trading pair:', error);
    throw error;
  }
}

// Remove a spot trading pair
export const removeSpotTradingPair = async (id: string, token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/admin/spot/trading-pair/remove/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error removing spot trading pair:', error);
    throw error;
  }
}

// Remove all spot trading pairs
export const removeAllSpotTradingPairs = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/admin/spot/trading-pair/remove-all`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error removing all spot trading pairs:', error);
    throw error;
  }
}