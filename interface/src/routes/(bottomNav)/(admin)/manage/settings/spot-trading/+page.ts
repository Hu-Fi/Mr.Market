import { getSpotInfo } from "$lib/helpers/hufi/spot";

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends }) => {
  depends('admin:settings:spot-trading');
  return {
    spotInfo: await getSpotInfo(),
  }
}
