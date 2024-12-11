import { getCoingeckoMarket, getSpotTradingPairs } from '$lib/helpers/hufi/coin';
import { getGrowBasicInfo } from '$lib/helpers/hufi/grow';
import { getSpotInfo } from '$lib/helpers/hufi/spot';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  try {
    const market = getCoingeckoMarket('all', 1)
    const pairs = getSpotTradingPairs()
    const growInfo = getGrowBasicInfo()
    const spotInfo = getSpotInfo()
    console.log (
      {
        market,
        pairs,
        growInfo,
        spotInfo
      }
    )
    return {
      market,
      pairs,
      growInfo,
      spotInfo
    }
  } catch (e) {
    console.log(e)
		return {}
  }
}