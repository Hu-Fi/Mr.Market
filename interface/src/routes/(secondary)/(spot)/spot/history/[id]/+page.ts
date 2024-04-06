import { validate } from 'uuid';
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
    orderId: order_id,
  }
}
