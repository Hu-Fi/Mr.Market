export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	const exchange = params['exchange'] as string
	const pair = params['pair'] as string

	return {exchange, pair}
}