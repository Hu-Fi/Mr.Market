<script lang="ts">
  import CampaignSmallCard from "$lib/components/grow/marketMaking/hufi/CampaignSmallCard.svelte";
  import IntroCard from "$lib/components/grow/marketMaking/hufi/IntroCard.svelte";
  import { formatCampaigns } from "$lib/helpers/hufi/campaignFormatter";

  export let data;

  // Format the API data for display
  $: campaigns = data.active_campaigns?.results
    ? formatCampaigns(data.active_campaigns.results)
    : [];
</script>

<IntroCard />

<div
  class="campaigns-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 bg-base-100 mt-4 mb-36 content-start"
>
  {#if campaigns.length > 0}
    {#each campaigns as campaign}
      <CampaignSmallCard {campaign} />
    {/each}
  {:else}
    <div
      class="col-span-full flex flex-col items-center justify-center py-20 text-base-content/60"
    >
      <p class="text-xl font-semibold mb-2">No Active Campaigns</p>
      <p class="text-sm">There are currently no active campaigns available.</p>
    </div>
  {/if}
</div>
