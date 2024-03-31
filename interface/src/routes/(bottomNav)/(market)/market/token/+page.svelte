<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { sortCoins } from "$lib/helpers/sortTable";
  import type { CoingeckoToken } from "$lib/types/coingecko/token";
  import { activeSecondTab, asc, CoinMarketCategory, selectedField } from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import TokenFilterLoader from "$lib/components/skeleton/market/tokenFilterLoader.svelte";
  import { marketQueryFn } from "$lib/helpers/hufi/coin";
  import SelectCategory from "$lib/components/market/elements/selectCategory.svelte";

  let defaults: CoingeckoToken[] = [];

  $: tokens =
    $activeSecondTab === 0
      ? defaults
      : $activeSecondTab === 1
        ? defaults.slice(0, 10)
        : $activeSecondTab === 2
          ? defaults.slice(5, 10)
          : $activeSecondTab === 3
            ? defaults.slice(1, 6)
            : $activeSecondTab === 4
              ? defaults.slice(3, 7)
              : $activeSecondTab === 5
                ? defaults.slice(5, 9)
                : $activeSecondTab === 6
                  ? defaults.slice(1, 9)
                  : $activeSecondTab === 7
                    ? defaults.slice(3, 6)
                    : $activeSecondTab === 8
                      ? defaults.slice(2, 8)
                      : $activeSecondTab === 9
                        ? defaults.slice(3, 8)
                        : $activeSecondTab === 10
                          ? defaults.slice(1, 7)
                          : defaults;

  $: sortedTokens = tokens.length != 0 ? sortCoins($selectedField, tokens, $asc) : [];

  let resolved = false;

  const handleSuccess = (x) => {
    (resolved = true), (defaults = x);
  }
  const handleFailure = (e) => {
    console.log(e);
    resolved = false;
  }

  CoinMarketCategory.subscribe((currentValue) => {
    resolved = false;
    marketQueryFn(currentValue).then(handleSuccess).catch(handleFailure)
  })

  $page.data.market
    .then(handleSuccess)
    .catch(handleFailure);
  onDestroy(()=> {
    activeSecondTab.set(0)
  })
</script>

<div class="flex flex-col">
  <div class="w-full mb-24">
    <SelectCategory />
    <table class="table w-full">
      {#if !resolved}
        <TokenFilterLoader />
        {#each Array(12) as _}
          <SingleTokenLoader />
        {/each}
      {:else}
        <table class="table w-full">
          <TableColumns />
          <tbody>
            {#each sortedTokens as token}
              <SingleToken {token} />
            {/each}
          </tbody>
        </table>
      {/if}
    </table>
  </div>
</div>
