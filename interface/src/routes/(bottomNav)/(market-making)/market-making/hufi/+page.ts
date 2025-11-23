import { getActiveCampaigns } from "$lib/helpers/hufi/campaignLauncher.js";

export const load = async () => {
  return {
    active_campaigns: await getActiveCampaigns(137),
  }
}
