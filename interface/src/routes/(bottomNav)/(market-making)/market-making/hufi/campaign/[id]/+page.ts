import { getSpecificCampaginDetail } from "$lib/helpers/hufi/campaignLauncher.js";
import { formatCampaign } from "$lib/helpers/hufi/campaignFormatter";

export const load = async ({ params }) => {
  return {
    campaign: await getSpecificCampaginDetail(137, params.id),
  };
}
