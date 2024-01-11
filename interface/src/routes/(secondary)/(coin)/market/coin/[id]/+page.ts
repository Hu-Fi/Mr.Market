import { coinMarketChart, coinQueryFn } from "$lib/helpers/hufi";
import { formatDecimals } from "$lib/helpers/utils.js";
import { ChartPrice } from "$lib/stores/market.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	return {
		coin: coinQueryFn(params.id),
		chart: coinMarketChart(params.id, '24h')
	}
}