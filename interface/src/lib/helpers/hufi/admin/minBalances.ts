import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export const fetchMiniumBalanceSettings = async (jwtToken: string): Promise<any> => {
  const url = `${HUFI_BACKEND_URL}/rebalance/minimum_balances`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch minium balance settings:', error);
    throw error;
  }
}
