const API_BASE_URL = 'https://bigone.com';

export const getFeeByAssetID = (symbol: string) => {
  fetch(`${API_BASE_URL}/api/uc/v2/assets/${symbol.toUpperCase()}`);
};
