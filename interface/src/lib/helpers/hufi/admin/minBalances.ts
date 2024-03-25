export const fetchMiniumBalanceSettings = async (): Promise<any> => {
  const url = 'http://yourserver.com/rebalance/minium_balances';
  const token = 'YOUR_JWT_TOKEN';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
