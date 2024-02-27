import { goto } from '$app/navigation';
import { SUPPORTED_EXCHANGES, SUPPORTED_UNIQUE_PAIRS } from '$lib/helpers/constants';

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
	
	if (!SUPPORTED_EXCHANGES.includes(exchange)) {
		console.log('Unsupported exchange')
		goto('/market/candle/binance/BTC-USDT')
		return
	}
	if (!SUPPORTED_UNIQUE_PAIRS.includes(pair)) {
		console.log('Unsupported pair')
		goto('/market/candle/binance/BTC-USDT')
		return
	}
	return {exchange, pair}
}