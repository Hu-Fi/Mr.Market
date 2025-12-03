<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";

  import type { SpotTradingPair } from "$lib/types/hufi/spot";
  import Loading from "$lib/components/common/loading.svelte";
  import AddTradingPair from "$lib/components/admin/settings/spotTrading/AddTradingPair.svelte";
  import TradingPairList from "$lib/components/admin/settings/spotTrading/TradingPairList.svelte";

  let isRefreshing = false;

  async function RefreshSpotTradingPairs() {
    isRefreshing = true;
    await invalidate("admin:settings:spot-trading").finally(() => {
      isRefreshing = false;
    });
  }

  $: configuredExchanges = $page.data.growInfo?.exchanges || [];
</script>

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <button
          on:click={() => window.history.back()}
          class="btn btn-ghost btn-circle btn-sm"
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
        <span class="text-3xl font-bold text-left">{$_("spot_trading")}</span>
      </div>
      <p class="text-base-content/60">{$_("manage_spot_trading_pairs")}</p>
    </div>

    <div class="flex items-center gap-3">
      <AddTradingPair {configuredExchanges} />
      <button
        class="btn btn-ghost btn-circle"
        on:click={() => RefreshSpotTradingPairs()}
      >
        <span
          class={clsx(isRefreshing && "loading loading-spinner loading-sm")}
        >
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

  {#await $page.data.spotInfo}
    <div class="w-full h-64 flex justify-center items-center">
      <Loading />
    </div>
  {:then spotInfo}
    {#if !spotInfo.trading_pairs}
      <div
        class="w-full h-64 flex flex-col justify-center items-center gap-4 text-base-content/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <p>{$_("failed_to_load_data")}</p>
        <button
          class="btn btn-sm btn-ghost"
          on:click={() => RefreshSpotTradingPairs()}
        >
          {$_("reload")}
        </button>
      </div>
    {:else}
      <TradingPairList tradingPairs={spotInfo.trading_pairs} />
    {/if}
  {/await}
</div>
