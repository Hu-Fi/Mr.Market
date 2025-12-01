<script lang="ts">
  import { goto } from "$app/navigation";
  import CampaignCard from "$lib/components/grow/marketMaking/hufi/CampaignCard.svelte";

  export let data;
</script>

<div class="bg-base-100 p-4 md:p-8">
  {#if data.campaign}
    <CampaignCard campaign={data.campaign} />
  {:else}
    <div
      class="flex flex-col items-center justify-center h-64 text-base-content/60"
    >
      <p class="text-xl font-semibold">Campaign not found</p>
      <button
        class="btn btn-link text-primary"
        on:click={() => goto("/market-making/hufi")}>Go back</button
      >
    </div>
  {/if}
</div>
