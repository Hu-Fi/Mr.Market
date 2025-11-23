import { getActiveCampaigns } from "$lib/helpers/hufi/campaignLauncher.js";
import { formatCampaign } from "$lib/helpers/hufi/campaignFormatter";

export const load = async ({ params }) => {
  const { id } = params;

  let campaign = null;

  try {
    const response = await getActiveCampaigns(137);
    if (response?.results && Array.isArray(response.results)) {
      const apiCampaign = response.results.find((c: any) => c.address === id);
      if (apiCampaign) {
        campaign = formatCampaign(apiCampaign);
      }
    }
  } catch (e) {
    console.error("Failed to fetch campaigns", e);
  }

  return {
    campaign
  };
}
