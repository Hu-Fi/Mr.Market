<script lang="ts">
  import { goto } from "$app/navigation";
  import CampaignSmallCard from "$lib/components/grow/marketMaking/hufi/CampaignSmallCard.svelte";
  import { formatCampaigns } from "$lib/helpers/hufi/campaignFormatter";

  export let data;

  // Format the API data for display
  $: campaigns = data.active_campaigns?.results
    ? formatCampaigns(data.active_campaigns.results)
    : [];

  const handleBack = () => {
    goto("/market-making");
  };
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <div
    class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] h-[36px]! min-h-[36px]!"
  >
    <button class="" on:click={handleBack}>
      <!-- Chevron left Icon -->
      <svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        /></svg
      >
    </button>
  </div>
</header>

<div
  class="p-4 m-2 rounded-2xl border border-slate-200 h-32 flex items-center justify-center"
>
  <span> Place holder for intro card of hufi campagin </span>
</div>

<div
  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 bg-base-100 mb-36 content-start"
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
