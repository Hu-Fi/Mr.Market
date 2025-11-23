<script lang="ts">
  import { goto } from "$app/navigation";
  import CampaignCard from "$lib/components/grow/marketMaking/hufi/CampaignCard.svelte";

  export let data;

  const handleBack = () => {
    goto("/market-making/hufi");
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
