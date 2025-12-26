<script lang="ts">
  import { _ } from "svelte-i18n";
  import { activeCoinTab } from "$lib/stores/home";
  import { sortCoins } from "$lib/helpers/sortTable";
  import InfiniteLoading from "svelte-infinite-loading";
  import { getCoingeckoMarket } from "$lib/helpers/mrm/coin";
  import {
    asc,
    marketData,
    marketDataExtened,
    marketDataPage,
    marketDataState,
    selectedField,
    stopMarketQuery,
  } from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import FilterLoader from "$lib/components/skeleton/market/filterLoader.svelte";
  import NoResult from "$lib/components/common/NoResult.svelte";

  let infiniteId = Symbol();

  function infiniteHandler({
    detail: { loaded, complete },
  }: {
    detail: { loaded: () => void; complete: () => void };
  }) {
    // Set max page to 8, limit 2000 tokens
    if ($marketDataPage === 8) {
      complete();
      return;
    }
    getCoingeckoMarket("all", $marketDataPage + 1)
      .then((data) => {
        stopMarketQuery.set(true);
        if (data && data.length) {
          marketDataPage.set($marketDataPage + 1);
          const sortedData = sortCoins($selectedField, data, $asc);
          marketDataExtened.update((prev) => [...prev, ...sortedData]);
          loaded();
        } else {
          complete();
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        complete();
      });
  }

  $: sortedTokens = $stopMarketQuery
    ? sortCoins($selectedField, $marketDataExtened, $asc)
    : sortCoins($selectedField, $marketData, $asc);
  $: if (!$stopMarketQuery) marketDataExtened.set($marketData);
  $: resolved = $marketDataState !== "loading";
  $: failed = $marketDataState === "error";
</script>

<div class="flex flex-col">
  <div class="w-full mb-24">
    {#if !resolved}
      <div class="w-full pl-4 mt-4">
        <FilterLoader />
      </div>
      <!-- Loading -->
      {#each Array(12) as _}
        <SingleTokenLoader />
      {/each}
    {:else if !failed}
      <table class="table w-full infinite-wrapper">
        <TableColumns />
        <tbody>
          {#if sortedTokens.length > 0}
            {#each sortedTokens as token}
              <SingleToken {token} />
            {/each}
            {#if $activeCoinTab === 0}
              <InfiniteLoading
                on:infinite={infiniteHandler}
                spinner="spiral"
                identifier={infiniteId}
              >
                <span slot="noResults" class="text-sm opacity-80"
                  >{$_("no_result_found")}</span
                >
                <span slot="noMore" class="text-sm opacity-80" />
              </InfiniteLoading>
            {/if}
          {:else}
            <NoResult />
          {/if}
        </tbody>
      </table>
    {:else}
      <!-- Error -->
      <div class="my-36 text-center flex flex-col space-y-3">
        <span class="text-sm opacity-80"
          >{$_("failed_to_load_market_data")}</span
        >
        <div>
          <button
            class="btn btn-sm rounded-2xl"
            on:click={() => {
              window.location.reload();
            }}
          >
            <span class="opacity-80 text-xs">{$_("retry")}</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
