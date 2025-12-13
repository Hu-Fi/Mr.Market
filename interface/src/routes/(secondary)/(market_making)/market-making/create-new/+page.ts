import { getSupportedExchanges } from "$lib/helpers/hufi/campaignLauncher.js";
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
  return {
    // Get supported exchanges should fetch from Mr.Market backend, instead of HuFi
    campaign_exchanges: getSupportedExchanges(),
  }
}