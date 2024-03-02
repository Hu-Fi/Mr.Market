<script lang="ts">
  import { _ } from "svelte-i18n";
  import { BN } from "$lib/helpers/utils";
  import { Input, InputAsset, Output, OutputAsset } from "$lib/stores/swap";

  let toSubFrom = true;
  let openDetails = false;

  let fee = 0.01;
  let route = [
    {exchange: $_('binance'), from: 'ETH', to: 'USDT', from_icon: '', to_icon:'', from_chain_icon: '', to_chain_icon: ''},
    {exchange: $_('gate'), from: 'USDT', to: 'HMT',    from_icon: '', to_icon:'', from_chain_icon: '', to_chain_icon: ''},
  ]

  const getRouteString = (route: object[]) => {
    let s = '';
    for (let i = 0; i<route.length; i++) {
      s+=`${route[i].exchange}`;
      if (i!=route.length-1) {
        s+=' -> '
      }
    }
    return s
  }
</script>

<div class="flex flex-col mx-4 !mt-4 space-y-6">
  <div class="flex items-center justify-between">
    <button
      class="flex items-center justify-start"
      on:click={() => (toSubFrom = !toSubFrom)}
    >
      {#if toSubFrom}
        <span class="text-xs mx-2">
          1 {$OutputAsset.symbol} = {!$Output || !$Input
            ? "..."
            : BN($Input).div($Output)}
          {$InputAsset.symbol}
        </span>
      {:else}
        <span class="text-xs mx-2">
          1 {$InputAsset.symbol} = {!$Output || !$Input
            ? "..."
            : BN($Output).div($Input)}
          {$OutputAsset.symbol}
        </span>
      {/if}
    </button>
    
    <button class="mx-2 flex flex-1 items-center justify-end" on:click={()=>openDetails=!openDetails}>
      {#if !openDetails}
      <!-- Caret down Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="opacity-100 h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
      {:else}
        <!-- Caret up Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="opacity-100 h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
      {/if}  
    </button>
  </div>

  {#if openDetails}
    <div class="flex flex-col rounded-2xl border border-base-300 p-4 px-6 space-y-4 text-sm">
      <div class="flex w-full items-center justify-between">
        <span class="opacity-60"> {$_('fee')} </span>
        <span> {fee}% </span>
      </div>

      <div class="flex w-full items-center justify-between">
        <span class="opacity-60"> {$_('route')} </span>
        <div>
          <span class="capitalize"> {getRouteString(route)} </span>
        </div>
      </div>
    </div>
  {/if}
</div>