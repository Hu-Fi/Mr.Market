<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";

  import type { MarketMakingPair } from "$lib/types/hufi/grow";
  import AddMarketMakingPair from "$lib/components/admin/settings/marketMaking/AddMarketMakingPair.svelte";
  import MarketMakingPairList from "$lib/components/admin/settings/marketMaking/MarketMakingPairList.svelte";

  $: marketMakingPairs = $page.data.growInfo.market_making
    .pairs as MarketMakingPair[];
  $: configuredExchanges = $page.data.growInfo.exchanges || [];

  let isRefreshing = false;

  async function RefreshMarketMakingPairs() {
    isRefreshing = true;
    await invalidate("admin:settings:market-making").finally(() => {
      isRefreshing = false;
    });
  }
</script>

<div class="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <button
        on:click={() => window.history.back()}
        class="btn btn-ghost btn-circle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <div>
        <h1 class="text-3xl font-bold">{$_("market_making")}</h1>
        <p class="text-sm text-base-content/60">
          {$_("manage_market_making_pairs")}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <AddMarketMakingPair
        {configuredExchanges}
        on:refresh={RefreshMarketMakingPairs}
      />
      <button
        class="btn btn-square btn-outline"
        on:click={() => RefreshMarketMakingPairs()}
      >
        <span class={isRefreshing ? "loading loading-spinner loading-sm" : ""}>
          {#if !isRefreshing}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          {/if}
        </span>
      </button>
    </div>
  </div>

  <MarketMakingPairList
    {marketMakingPairs}
    on:refresh={RefreshMarketMakingPairs}
  />
</div>
