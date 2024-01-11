<script lang="ts">
  import { _ } from "svelte-i18n"
  import EmptyToken from "$lib/images/empty-token.svg"
  import { mmCoinSelector } from "$lib/stores/grow";
  
  let tooltipOpen = false;
  let token = {"id": "bitcoin","symbol": "btc","name": "Bitcoin","image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price": 42647,"market_cap": 835106968766,"market_cap_rank": 1,"fully_diluted_valuation": 895363344292,"total_volume": 12072391201,"high_24h": 42782,"low_24h": 42095,"price_change_24h": 153.96,"price_change_percentage_24h": 0.36232,"market_cap_change_24h": 3004861113,"market_cap_change_percentage_24h": 0.36112,"circulating_supply": 19586737,"total_supply": 21000000,"max_supply": 21000000,"ath": 69045,"ath_change_percentage": -38.24065,"ath_date": "2021-11-10T14:24:11.849Z","atl": 67.81,"atl_change_percentage": 62784.86453,"atl_date": "2013-07-06T00:00:00.000Z","roi": null,"last_updated": "2024-01-01T14:46:24.444Z"}
</script>

<div class="flex flex-col space-y-6 w-full">
  <div class="flex items-center justify-center space-x-2">
    <span class="text-xl font-semibold ml-2"> 1. {$_('select_an_asset')} </span>
    <button on:click={()=>tooltipOpen=!tooltipOpen} class="mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
    </button>
  </div>
  
  <div class="flex justify-center">
    <button class="btn btn-lg bg-base-100 border-base-300 shadow-none hover:bg-base-100 rounded-full no-animation flex items-center space-x-5 px-16" on:click={()=>mmCoinSelector.set(!$mmCoinSelector)}>
      <div class="avatar h-10 w-10">
        <img src={token.image || EmptyToken} alt="-" />
      </div>

      <span class="text-lg font-semibold">
        {token.name}
      </span>
      <div class="!ml-3">
        {#if $mmCoinSelector}
          <!-- Caret Up Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={"currentColor"}></path></svg>
        {:else}
          <!-- Caret Down Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={"currentColor"}></path></svg>
        {/if}      
      </div>
    </button>
  </div>
</div>