import { HUFI_BACKEND_URL } from "$lib/helpers/constants";
import { getHeaders, handleApiResponse } from "../common";

// Fetch all orders
export const fetchAllOrders = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

// Fetch all arbitrage orders
export const fetchAllArbitrageOrders = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/arbitrage/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all arbitrage orders:', error);
    throw error;
  }
}

// Fetch arbitrage orders by user ID
export const fetchArbitrageOrdersByUserId = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/arbitrage/${userId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching arbitrage orders by user ID:', error);
    throw error;
  }
}

// Fetch all spot orders
export const fetchAllSpotOrders = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/spot/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all spot orders:', error);
    throw error;
  }
}

// Fetch spot orders by user ID
export const fetchSpotOrdersByUserId = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/spot/${userId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching spot orders by user ID:', error);
    throw error;
  }
}

// Fetch all market making orders
export const fetchAllMarketMakingOrders = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/market-making/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all market making orders:', error);
    throw error;
  }
}

// Fetch market making orders by user ID
export const fetchMarketMakingOrdersByUserId = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/market-making/${userId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching market making orders by user ID:', error);
    throw error;
  }
}

// Fetch all simply grow orders
export const fetchAllSimplyGrowOrders = async (token: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/simply-grow/all`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching all simply grow orders:', error);
    throw error;
  }
}

// Fetch simply grow orders by user ID
export const fetchSimplyGrowOrdersByUserId = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/admin/orders/simply-grow/${userId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching simply grow orders by user ID:', error);
    throw error;
  }
}
