<script lang="ts">
  import { _ } from "svelte-i18n";
  import { marketData, marketDataState } from "$lib/stores/market";
  import { sortCoins } from "$lib/helpers/sortTable";
  import { asc, selectedField } from "$lib/stores/home";

  import SingleToken from "$lib/components/market/elements/singleToken.svelte";
  import TableColumns from "$lib/components/home/markets/tableColumns.svelte";
  import SingleTokenLoader from "$lib/components/skeleton/market/singleTokenLoader.svelte";
  import FilterLoader from "$lib/components/skeleton/market/filterLoader.svelte";
  import type { CoingeckoToken } from "$lib/types/coingecko/token";

  let tokens: CoingeckoToken[] = [{"id":"bitcoin","symbol":"btc","name":"Bitcoin","image":"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price":42632,"market_cap":835055181228,"market_cap_rank":1,"fully_diluted_valuation":895305808841,"total_volume":12859406774,"high_24h":42782,"low_24h":42095,"price_change_24h":52.9,"price_change_percentage_24h":0.12424,"market_cap_change_24h":2568819209,"market_cap_change_percentage_24h":0.30857,"circulating_supply":19586781,"total_supply":21000000,"max_supply":21000000,"ath":69045,"ath_change_percentage":-38.2734,"ath_date":"2021-11-10T14:24:11.849Z","atl":67.81,"atl_change_percentage":62751.51889,"atl_date":"2013-07-06T00:00:00.000Z","last_updated":"2024-01-01T15:12:29.021Z"}, ]

  $: sortedTokens = sortCoins($selectedField, !$marketData || $marketDataState === 'loading' ? tokens : $marketData, $asc)
  $: resolved = $marketDataState !== 'loading'
  $: failed = $marketDataState === 'error'
</script>

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