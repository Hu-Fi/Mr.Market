import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export const getOrdersByUser = async (userId: string) => {
  try {
    const response = await fetch(`${HUFI_BACKEND_URL}/exchange/orders/user/${userId}`);
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
    const response = await fetch(`${HUFI_BACKEND_URL}/exchange/orders/order/${orderId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by id:', error);
  }
};