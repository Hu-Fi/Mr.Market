import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getPaymentState = async (orderId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/payment_state/${orderId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching payment state:', error);
  }
}

export const getAllStrategyByUser = async (userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/all?userId=${userId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all strategies for user:', error);
  }
}

export const getAllArbitrageByUser = async (userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/arbitrage/all?userId=${userId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all arbitrage by user:', error);
  }
}

export const getArbitrageDetailsById = async (id: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/arbitrage/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching arbitrage details by id:', error);
  }
}

export const stopArbitrage = async (userId: string, clientId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/arbitrage/stop?userId=${userId}&clientId=${clientId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error stopping arbitrage strategy for user:', error);
  }
}

export const getAllMarketMakingByUser = async (userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/market_making/all?userId=${userId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all market making by user:', error);
  }
}

export const getMarketMakingDetailsById = async (id: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/market_making/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching market making details by id:', error);
  }
}

export const stopPureMarketMaking = async (userId: string, clientId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/strategy/market_making/stop?userId=${userId}&clientId=${clientId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error stopping pure market making strategy for user:', error);
  }
}