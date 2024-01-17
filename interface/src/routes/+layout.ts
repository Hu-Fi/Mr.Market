import { marketQueryFn } from '$lib/helpers/hufi/coin.js';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
  try {
    const market = marketQueryFn()
    return {
      market
    }
  } catch (e) {
    console.log(e)
		return {}
  }
}