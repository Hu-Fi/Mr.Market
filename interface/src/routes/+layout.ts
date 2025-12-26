import { getCoingeckoMarket, getSpotTradingPairs } from '$lib/helpers/mrm/coin';
import { getGrowBasicInfo } from '$lib/helpers/mrm/grow';
import { getSpotInfo } from '$lib/helpers/mrm/spot';
import { getBasicInfo } from '$lib/helpers/mrm/base';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  try {
    const basicInfo = getBasicInfo()
    const market = getCoingeckoMarket('all', 1)
    const pairs = getSpotTradingPairs()
    const growInfo = getGrowBasicInfo()
    const spotInfo = getSpotInfo()
    return {
      market,
      pairs,
      growInfo,
      spotInfo,
      basicInfo
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}