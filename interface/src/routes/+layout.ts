import { getCoingeckoMarket, getSpotTradingPairs } from '$lib/helpers/hufi/coin';
import { getGrowBasicInfo } from '$lib/helpers/hufi/grow';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  try {
    const market = getCoingeckoMarket('all', 1)
    const pairs = getSpotTradingPairs()
    const growInfo = getGrowBasicInfo()
    return {
      market,
      pairs,
      growInfo
    }
  } catch (e) {
    console.log(e)
		return {}
  }
}