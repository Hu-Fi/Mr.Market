import { coinMarketChart, coinQueryFn } from "$lib/helpers/hufi/coin";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	return {
		coin: coinQueryFn(params.id),
		chart: coinMarketChart(params.id, '24h')
	}
}