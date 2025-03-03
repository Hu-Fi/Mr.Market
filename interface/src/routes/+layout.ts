import { getCoingeckoMarket } from '$lib/helpers/hufi/coin';
import { getGrowBasicInfo } from '$lib/helpers/hufi/grow';
import { getSpotInfo } from '$lib/helpers/hufi/spot';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({depends}) {
  try {
    depends('base:spotInfo')
    const market = getCoingeckoMarket('all', 1)
    const growInfo = getGrowBasicInfo()
    const spotInfo = getSpotInfo()
    return {
      market,
      growInfo,
      spotInfo
    }
  } catch (e) {
    console.log(e)
		return {}
  }
}