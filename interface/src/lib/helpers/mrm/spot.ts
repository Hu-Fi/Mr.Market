import { MRM_BACKEND_URL } from "$lib/helpers/constants";

import type { SpotInfo } from "$lib/types/hufi/spot";

export const getSpotInfo = async (): Promise<SpotInfo> => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/spot/info`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching spot info:', error);
  }
  return {} as SpotInfo;
}

export const getOrdersByUser = async (userId: string) => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/exchange/orders/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders by user:', error);
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/exchange/orders/order/${orderId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by id:', error);
  }
};