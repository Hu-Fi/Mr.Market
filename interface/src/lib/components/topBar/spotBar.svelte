<script lang="ts">
  import { goto } from "$app/navigation";
  import { CandlePair } from "$lib/stores/market";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { pair, pairSelectorDialog } from "$lib/stores/spot";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import SpotPairSelector from "$lib/components/dialogs/spotPairSelector.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <!-- Title and change -->
  <button class="flex items-center pl-4" on:click={()=>pairSelectorDialog.set(true)} data-testid="spot_pair_selector">
    <img src={findExchangeIconByIdentifier($pair.exchange)} alt="icon" loading="lazy" class="w-5 h-5 mr-1" />
    <span class="font-black text-lg" title="pair-name"> {$pair.symbol.split('/')[0]+"/"+$pair.symbol.split('/')[1]} </span>
    {#if !$pairSelectorDialog}
      <!-- Caret down Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
    {:else}
      <!-- Caret up Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
    {/if}
  </button>
  <SpotPairSelector />

  <div class="flex items-center space-x-4">
    <!-- CandleStick -->
    <button on:click={()=>{CandlePair.set($pair); goto(`/market/candle/${$pair.exchange}/${$pair.symbol.split('/')[0]+"-"+$pair.symbol.split('/')[1]}`)}}>
      <svg class="w-5 h-5 stroke-base-content" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 22V15" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 5V2" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 22V19" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 9V2" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 7V13C9.5 14.1 9 15 7.5 15H5.5C4 15 3.5 14.1 3.5 13V7C3.5 5.9 4 5 5.5 5H7.5C9 5 9.5 5.9 9.5 7Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 11V17C20.5 18.1 20 19 18.5 19H16.5C15 19 14.5 18.1 14.5 17V11C14.5 9.9 15 9 16.5 9H18.5C20 9 20.5 9.9 20.5 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <MixinMenu />
  </div>
</div>
