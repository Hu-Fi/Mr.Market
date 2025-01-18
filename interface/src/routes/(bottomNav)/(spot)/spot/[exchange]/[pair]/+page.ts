import { goto } from '$app/navigation';
import { SUPPORTED_EXCHANGES, SUPPORTED_UNIQUE_PAIRS } from '$lib/helpers/constants.js';

export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	let exchange = params['exchange'] as string
	let pair = params['pair'] as string

	if (!exchange && !pair) {
		return
	}
	exchange = String(exchange).toLowerCase();
	pair = String(pair).replace('-', "/").toUpperCase();
	
	return {exchange, pair}
}