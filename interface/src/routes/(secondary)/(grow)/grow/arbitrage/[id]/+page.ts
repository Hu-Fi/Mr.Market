import { getArbitrageById } from "$lib/helpers/hufi/coin";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	return {
		// data: getArbitrageById(params.id)
	}
}