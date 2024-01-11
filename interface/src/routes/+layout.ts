import { marketQueryFn } from '$lib/helpers/hufi.js';

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