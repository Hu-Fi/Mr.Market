import { HUFI_BACKEND_URL } from "$lib/helpers/constants";

export const fetchRebalanceExchanges = async (jwtToken: string): Promise<any> => {
  const url = `${HUFI_BACKEND_URL}/rebalance/minimum_balance/exchanges`;

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
export const fetchMiniumBalanceSettings = async (jwtToken: string): Promise<any> => {
  const url = `${HUFI_BACKEND_URL}/rebalance/minimum_balance/all`;

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

export const addMinimumBalanceSetting = async (jwtToken: string, settings: { symbol: string; assetId: string; exchangeName: string; minimumBalance: string; }): Promise<any> => {
  const url = `${HUFI_BACKEND_URL}/rebalance/minimum_balance/add`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add minimum balance setting:', error);
    throw error;
  }
}

export const updateMinimumBalanceSetting = async (jwtToken: string, settings: { assetId: string; exchangeName: string; minimumBalance: string; }): Promise<any> => {
  const url = `${HUFI_BACKEND_URL}/rebalance/minimum_balance/update`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
        message: data.message,
    };
  } catch (error) {
    console.error('Failed to update minimum balance setting:', error);
    throw error;
  }
}