import toast from "svelte-french-toast";
import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "$lib/helpers/hufi/common";
import { exchangeApiKeys, exchangeApiKeysLoading } from "$lib/stores/admin";
import type { ExchangeAPIKeysConfig } from "$lib/types/hufi/exchanges";

// Wrapper
export const loadExchangeApiKeys = async () => {
  exchangeApiKeysLoading.set(true);
  const token = localStorage.getItem('admin-access-token');
  if (!token) {
    exchangeApiKeysLoading.set(false);
    return;
  }
  const res = await getAllAPIKeys(token);
  if (!res || !res.data) {
    toast.error('Failed to load all api keys');
    exchangeApiKeysLoading.set(false);
    return;
  }
  exchangeApiKeys.set(res.data);
  exchangeApiKeysLoading.set(false);
}

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

export const addExchangeApiKey = async (token: string, data: ExchangeAPIKeysConfig): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/api-key/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error adding API key:', error);
    throw error;
  }
};

export const removeExchangeApiKey = async (token: string, keyId: string): Promise<unknown> => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/exchange/api-key/remove/${keyId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error removing API key:', error);
    throw error;
  }
};