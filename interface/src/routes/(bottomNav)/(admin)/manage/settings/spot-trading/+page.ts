import { getSpotInfo } from "$lib/helpers/mrm/spot";
import { getGrowBasicInfo } from "$lib/helpers/mrm/grow";

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends }) => {
  depends('admin:settings:spot-trading');
  return {
    spotInfo: await getSpotInfo(),
    growInfo: await getGrowBasicInfo(),
  }
}
