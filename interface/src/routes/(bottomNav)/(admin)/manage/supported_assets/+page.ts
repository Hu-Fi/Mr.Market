import { getGrowBasicInfo } from "$lib/helpers/hufi/grow";
import { getSpotInfo } from "$lib/helpers/hufi/spot";

/** @type {import('./$types').LayoutServerLoad} */
// @ts-ignore
export async function load({depends}) {
    depends('admin:settings');
    return {
        growInfo: await getGrowBasicInfo(),
        spotInfo: getSpotInfo(),
    }
}