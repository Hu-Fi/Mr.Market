import { getSpotInfo } from "$lib/helpers/hufi/spot";

/** @type {import('./$types').PageServerLoad} */
export async function load({ depends }) {
  depends('admin:settings:spot-trading');
  return {
    spotInfo: await getSpotInfo(),
  }
}
