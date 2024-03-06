import axios from 'axios';
import { NetworkAssetResponse } from '@mixin.dev/mixin-node-sdk';

const API_BASE_URL = 'https://api.mixin.one';

export const getMixinSafeFeeByID = async (
  asset_id: string,
): Promise<string> => {
  const resp = await axios.get(`${API_BASE_URL}/network/assets/${asset_id}`);
  if (resp.status != 200) {
    throw Error('MixinSafe getMixinSafeFeeByID() failed');
  }
  const data = resp.data.data as NetworkAssetResponse;
  console.log(data);
  return data.fee;
};
