import { MRM_BACKEND_URL } from "$lib/helpers/constants";

export const getOauth = async (code: string) => {
  try {
    const response = await fetch(`${MRM_BACKEND_URL}/auth/oauth?code=${code}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders by user:', error);
  }
}