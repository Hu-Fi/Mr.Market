import { goto } from '$app/navigation';
import { SUPPORTED_EXCHANGES } from '$lib/helpers/constants';

export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	let exchange = params['exchange'] as string
	let pair = params['pair'] as string

	if (!exchange && !pair) {
		return
	}
	exchange = String(exchange).toLowerCase();
	pair = String(pair).replace('-', "/").toUpperCase();

	if (!SUPPORTED_EXCHANGES.includes(exchange)) {
		console.log('Unsupported exchange')
		goto('/market/candle/okx/BTC-USDT')
		return
	}
	return { exchange, pair }
}