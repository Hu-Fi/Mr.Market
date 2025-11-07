import { getActiveCampaigns } from "$lib/helpers/hufi/campaignLauncher.js";
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
  return {
    active_campaigns: getActiveCampaigns(137),
  }
}