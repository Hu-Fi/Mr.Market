import axios from 'axios';
import symbolsMap from './symbols.json';
import { FeeResponse } from 'src/common/types/withdrawal/bigone';

const FEE_BASE_URL = 'https://bigone.com';

export const assetIDtoSymbol = (asset_id: string) => {
  // Map Mixin assetID to BigOne symbol
  return symbolsMap[asset_id];
};

export const getFeeBySymbol = async (symbol: string): Promise<string> => {
  const URL = `${FEE_BASE_URL}/api/uc/v2/assets/${symbol.toUpperCase()}`;
  const resp = await axios.get(URL);
  if (resp.status != 200) {
    throw Error('BigOne getFeeBySymbol() failed');
  }
  const data = resp.data as FeeResponse;
  if (data.data.binding_gateways.length === 0) {
    throw Error(`BigOne doesn't have withdrawal gateway for ${symbol}`);
  }
  // Filter same chain
  // return fee
  return data.data.binding_gateways[0].withdrawal_fee;
};

export const getBigOneFeeByID = async (asset_id: string): Promise<string> => {
  return await getFeeBySymbol(assetIDtoSymbol(asset_id));
};
