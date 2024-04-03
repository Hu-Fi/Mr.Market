import { validate } from 'uuid';
import { getOrderById } from '$lib/helpers/hufi/spot';
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
	const order_id = params['id'] as string
	if (!order_id) {
		return
	}
  if (!validate(order_id)) {
    return
  }

	return {
    order: await getOrderById(order_id)
  }
}