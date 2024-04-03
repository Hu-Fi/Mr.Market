<script lang="ts">
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { sortCoins } from "$lib/helpers/sortTable";
  import type { CoingeckoToken } from "$lib/types/coingecko/token";
  import {activeSecondTab, asc, marketData, marketDataState, selectedField} from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import TokenFilterLoader from "$lib/components/skeleton/market/tokenFilterLoader.svelte";
  import { marketQueryFn } from "$lib/helpers/hufi/coin";
  import { CoinsTypeTabs } from "$lib/helpers/constants.js";

  let tokens: CoingeckoToken[] = $marketData || [];

  $: sortedTokens = tokens.length != 0 ? sortCoins($selectedField, tokens, $asc) : [];

  let resolved = $marketDataState !== 'loading';
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
