import { getMarketMakingDetailsById } from "$lib/helpers/mrm/strategy";

export async function load({ params }: { params: { id: string } }) {
  const order = await getMarketMakingDetailsById(params.id);

  return {
    order
  };
}
