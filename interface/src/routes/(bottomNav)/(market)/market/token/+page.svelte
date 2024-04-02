<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { sortCoins } from "$lib/helpers/sortTable";
  import type { CoingeckoToken } from "$lib/types/coingecko/token";
  import { activeSecondTab, asc, selectedField } from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import TokenFilterLoader from "$lib/components/skeleton/market/tokenFilterLoader.svelte";
  import { marketQueryFn } from "$lib/helpers/hufi/coin";
  import { CoinsTypeTabs } from "$lib/helpers/constants.js";

  let tokens: CoingeckoToken[] = [];

  $: sortedTokens = tokens.length != 0 ? sortCoins($selectedField, tokens, $asc) : [];

  let resolved = false;

  const handleSuccess = (x: CoingeckoToken[]) => {
    (resolved = true), (tokens = x);
  }
  const handleFailure = (e: unknown) => {
    console.log(e);
    resolved = false;
  }

  let interval: any
  activeSecondTab.subscribe((currentValue) => {
    resolved = false;
    clearInterval(interval)
    interval = setInterval(() => marketQueryFn(CoinsTypeTabs[currentValue].id).then(handleSuccess).catch(handleFailure))
  })
  clearInterval(interval)
  interval = $page.data.market
    .then(handleSuccess)
    .catch(handleFailure);
  onDestroy(()=> {
    activeSecondTab.set(0)
  })
</script>

<div class="flex flex-col">
  <div class="w-full mb-24">
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
