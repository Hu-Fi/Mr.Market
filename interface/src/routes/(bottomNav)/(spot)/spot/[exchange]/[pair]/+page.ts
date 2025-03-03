export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params, parent}) {
	let exchange = params['exchange'] as string
	let pair = params['pair'] as string
	const spotInfo = await (await parent()).spotInfo

	if (!exchange && !pair) {
		return
	}
	if (!/^[a-zA-Z0-9]+$/.test(exchange)) {
		return
	}

	exchange = String(exchange).toLowerCase();
	pair = String(pair).replace('-', "/").toUpperCase();
	
	return {exchange, pair, spot_fee: spotInfo?.data.fee.spot}
}