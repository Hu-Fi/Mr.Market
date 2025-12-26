import { getActiveCampaigns } from "$lib/helpers/mrm/campaignLauncher.js";

export const load = async () => {
  return {
    active_campaigns: await getActiveCampaigns(137),
  }
}
