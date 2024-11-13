<script lang="ts">
  import { _ } from "svelte-i18n";
  import { sortCoins } from "$lib/helpers/sortTable";
  import InfiniteLoading from 'svelte-infinite-loading';
  import { marketQueryFn } from "$lib/helpers/hufi/coin";
  import { asc, marketData, marketDataExtened, marketDataPage, marketDataState, selectedField, stopMarketQuery } from "$lib/stores/market";
  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/market/elements/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import FilterLoader from "$lib/components/skeleton/market/filterLoader.svelte";
  
  let infiniteId = Symbol();
	
  function infiniteHandler({ detail: { loaded, complete } }: { detail: { loaded: () => void, complete: () => void } }) {
    console.log('Fetching page:', $marketDataPage+1);
    marketQueryFn('', $marketDataPage+1)
      .then(data => {
        stopMarketQuery.set(true);
        if (data && data.length) {
          marketDataPage.set($marketDataPage+1);
          const sortedData = sortCoins($selectedField, data, $asc)
          marketDataExtened.update(prev => [...prev, ...sortedData]);
          loaded();
        } else {
          console.log('No more data to load');
          complete();
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        complete();
      });
  }

  $: if (!$stopMarketQuery) marketDataExtened.set($marketData)
  $: sortedTokens = $stopMarketQuery ? 
    sortCoins($selectedField, $marketDataExtened, $asc) : 
    sortCoins($selectedField, !$marketData || $marketDataState === 'loading' ? [] : $marketData, $asc)
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
        <table class="table w-full infinite-wrapper">
          <TableColumns />
          <tbody>
            {#each sortedTokens as token}
              <SingleToken token={token} />
            {/each}
            <InfiniteLoading on:infinite={infiniteHandler} spinner='spiral' identifier={infiniteId} />
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
