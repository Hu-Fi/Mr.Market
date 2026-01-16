import type { LayoutLoad } from "./$types";

import { initBotId } from "$lib/helpers/mixin/init";
import { getCoingeckoMarket, getSpotTradingPairs } from "$lib/helpers/mrm/coin";
import { getGrowBasicInfo } from "$lib/helpers/mrm/grow";
import { getSpotInfo } from "$lib/helpers/mrm/spot";
import { getBasicInfo } from "$lib/helpers/mrm/base";

export const ssr = false;

export const load: LayoutLoad = async () => {
  try {
    const botIdInit = initBotId();

    const basicInfo = getBasicInfo();
    const market = getCoingeckoMarket("all", 1);
    const pairs = getSpotTradingPairs();
    const growInfo = getGrowBasicInfo();
    const spotInfo = getSpotInfo();

    await botIdInit;

    return {
      market,
      pairs,
      growInfo,
      spotInfo,
      basicInfo,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
};
