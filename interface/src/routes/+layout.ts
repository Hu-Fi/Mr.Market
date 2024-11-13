import { marketQueryFn, pairsFn } from '$lib/helpers/hufi/coin.js';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  try {
    const market = marketQueryFn('', 1)
    const pairs = pairsFn()
    return {
      market,
      pairs
    }
  } catch (e) {
    console.log(e)
		return {}
  }
}