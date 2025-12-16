import { getSpecificCampaginDetail } from "$lib/helpers/mrm/campaignLauncher.js";
import { formatCampaign } from "$lib/helpers/mrm/campaignFormatter";

export const load = async ({ params }) => {
  return {
    campaign: getSpecificCampaginDetail(137, params.id),
  };
}
