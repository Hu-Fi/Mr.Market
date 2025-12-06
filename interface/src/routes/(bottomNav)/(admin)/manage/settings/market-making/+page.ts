import { getGrowBasicInfo } from "$lib/helpers/hufi/grow";

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ depends }) => {
  depends('admin:settings:market-making');
  return {
    growInfo: await getGrowBasicInfo(),
  }
}
