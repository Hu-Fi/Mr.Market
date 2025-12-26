import { getActiveCampaigns, getCampaignStats, getSupportedExchanges } from "$lib/helpers/mrm/campaignLauncher.js";
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
  return {
    active_campaigns: getActiveCampaigns(137),
    campaign_stats: getCampaignStats(137),
  }
}