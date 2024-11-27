import { getSimplyGrowDetailsById } from '$lib/helpers/hufi/strategy';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	return {
		data: await getSimplyGrowDetailsById(params.id),
	}
}