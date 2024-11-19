import { getGrowBasicInfo } from "$lib/helpers/hufi/grow";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({depends}) {
    depends('admin:settings');
    return {
        growInfo: await getGrowBasicInfo(),
    }
}