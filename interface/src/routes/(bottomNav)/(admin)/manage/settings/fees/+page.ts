/** @type {import('./$types').PageServerLoad} */
export async function load({ depends }) {
  depends('admin:settings:fees');
  return {};
}
