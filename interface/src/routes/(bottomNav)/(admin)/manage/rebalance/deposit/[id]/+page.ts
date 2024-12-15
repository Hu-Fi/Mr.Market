import { mixinAsset } from '$lib/helpers/mixin.js';

export const load = async ({ params }) => {
  const asset = await mixinAsset(params.id);
  if (asset.chain_id === params.id) {
    return { asset, chain: asset };
  }
  const chain = await mixinAsset(asset.chain_id);
  return { asset, chain };
};
