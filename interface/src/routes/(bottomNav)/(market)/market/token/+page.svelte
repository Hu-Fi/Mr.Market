<script lang="ts">
  import { _ } from "svelte-i18n";
  import { sortCoins } from "$lib/helpers/sortTable";
  import type { CoingeckoToken } from "$lib/types/coingecko/token";
  import { asc, marketData, marketDataState, selectedField } from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import FilterLoader from "$lib/components/skeleton/market/filterLoader.svelte";
  
  let tokens: CoingeckoToken[] = $marketData || [];
  $: sortedTokens = sortCoins($selectedField, !$marketData || $marketDataState === 'loading' ? tokens : $marketData, $asc)
  $: resolved = $marketDataState !== 'loading';
  $: failed = $marketDataState === 'error'
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
    {:else}
      {#if !failed}
        <table class="table w-full">
          <TableColumns />
          <tbody>
            {#each sortedTokens as token}
              <SingleToken token={token} />
            {/each}
          </tbody>
        </table>
      {:else}
      <!-- Error -->
        <div class="my-36 text-center flex flex-col space-y-3">
          <span class="text-sm opacity-80">{$_('failed_to_load_market_data')}</span>
          <div>
            <button class="btn btn-sm rounded-2xl" on:click={()=>{window.location.reload()}}>
              <span class="opacity-80 text-xs">{$_('retry')}</span>
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
