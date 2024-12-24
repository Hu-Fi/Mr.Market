import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "$lib/helpers/hufi/common";

// Get all API keys
export const getAllAPIKeys = async (token: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/api-key/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all balances:', error);
    throw error;
  }
}

// Get all currencies by keyId
export const getAllCurrenciesByKeyId = async (token: string, keyId: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/api-key/all-currencies/${keyId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all currencies:', error);
    throw error;
  }
}

// Get deposit address by keyId and currency
export const getDepositAddressByKeyIdAndCurrency = async (token: string, data: {
  apiKeyId: string;
  symbol: string;
  network: string;
}) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/deposit/exchange/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching deposit address:', error);
    throw error;
  }
}