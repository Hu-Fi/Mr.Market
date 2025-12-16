<script lang="ts">
  import { goto } from "$app/navigation";
  import CampaignCard from "$lib/components/grow/marketMaking/hufi/CampaignCard.svelte";

  export let data;
</script>

<div class="flex flex-col bg-base-100 min-h-screen pb-24">
  {#await data.campaign}
    <!-- Loading State -->
    <div class="flex flex-col space-y-6 p-4 md:p-8 animate-pulse">
      <!-- Header Skeleton -->
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-base-200"></div>
        <div class="flex flex-col gap-2">
          <div class="h-8 w-32 bg-base-200 rounded"></div>
          <div class="h-4 w-24 bg-base-200 rounded"></div>
        </div>
      </div>

      <!-- Badges Skeleton -->
      <div class="flex gap-2">
        <div class="h-6 w-20 bg-base-200 rounded-full"></div>
        <div class="h-6 w-20 bg-base-200 rounded-full"></div>
      </div>

      <!-- Content Sections Skeleton -->
      {#each Array(3) as _}
        <div class="flex flex-col space-y-4">
          <div class="h-10 bg-base-200 rounded"></div>
          <div class="space-y-3 px-6">
            {#each Array(4) as _}
              <div class="flex justify-between">
                <div class="h-4 w-32 bg-base-200 rounded"></div>
                <div class="h-4 w-24 bg-base-200 rounded"></div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:then campaign}
    {#if campaign}
      <CampaignCard {campaign} />
    {:else}
      <!-- Campaign Not Found -->
      <div class="flex flex-col items-center justify-center flex-1 px-4 py-20">
        <div
          class="flex flex-col items-center justify-center space-y-4 text-center max-w-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 text-base-content/30"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <div class="space-y-2">
            <p class="text-xl font-semibold text-base-content/80">
              Campaign Not Found
            </p>
            <p class="text-sm text-base-content/60">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <button
            class="btn btn-primary btn-sm rounded-full"
            on:click={() => goto("/market-making/hufi")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Campaigns
          </button>
        </div>
      </div>
    {/if}
  {:catch error}
    <!-- Error State -->
    <div class="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <div
        class="flex flex-col items-center justify-center space-y-4 text-center max-w-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 text-error/60"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div class="space-y-2">
          <p class="text-xl font-semibold text-base-content/80">
            Failed to Load Campaign
          </p>
          <p class="text-sm text-base-content/60">
            An error occurred while loading the campaign details. Please try
            again.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            class="btn btn-ghost btn-sm rounded-full"
            on:click={() => goto("/market-making/hufi")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Campaigns
          </button>
          <button
            class="btn btn-primary btn-sm rounded-full"
            on:click={() => window.location.reload()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    </div>
  {/await}
</div>
