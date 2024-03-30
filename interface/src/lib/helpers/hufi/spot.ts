import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export const getOrdersByUser = async (userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/exchange/orders/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders by user:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/exchange/orders/${orderId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by id:', error);
    throw error;
  }
};