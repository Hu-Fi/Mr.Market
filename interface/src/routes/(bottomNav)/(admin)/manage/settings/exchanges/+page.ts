import { getGrowBasicInfo } from "$lib/helpers/hufi/grow";

/** @type {import('./$types').PageServerLoad} */
export async function load({ depends }) {
  depends('admin:settings:exchanges');
  return {
    growInfo: await getGrowBasicInfo(),
  }
}
