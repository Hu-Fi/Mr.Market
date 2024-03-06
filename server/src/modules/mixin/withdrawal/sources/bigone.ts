import { FeeResponse } from 'src/types/withdrawal/bigone/bigone';

const FEE_BASE_URL = 'https://bigone.com';

export const getFeeBySymbol = async (symbol: string) => {
  const URL = `${FEE_BASE_URL}/api/uc/v2/assets/${symbol.toUpperCase()}`;
  const resp = await fetch(URL, { method: 'GET' });
  console.log(URL);
  console.log(resp);
};
