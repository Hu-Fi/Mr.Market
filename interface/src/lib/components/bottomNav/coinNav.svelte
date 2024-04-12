<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  // import { currentCoin } from "$lib/stores/market";

  const gotoCandleStick = () => {
    goto(`/market/candle/okx/BTC-USDT`)
    // goto(`/market/candle/${currentCoin.exchange}/${$currentCoin.symbol}-USDT`)
  }
</script>

<div class="btm-nav btm-nav-md shadow-2xl bg-base-100 visible md:invisible px-4">
  <div class="flex flex-row justify-start space-x-2">
    <!-- CandleStick Button -->
    <button class="btn bg-base-100 border-base-300 hover:bg-base-100 hover:border-base-300 no-animation flex items-center justify-center rounded-full focus:bg-base-100 focus:border-base-300" on:click={()=>{gotoCandleStick()}}>
      <svg class="w-6 h-6 mx-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 22V15" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 5V2" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 22V19" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 9V2" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 7V13C9.5 14.1 9 15 7.5 15H5.5C4 15 3.5 14.1 3.5 13V7C3.5 5.9 4 5 5.5 5H7.5C9 5 9.5 5.9 9.5 7Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 11V17C20.5 18.1 20 19 18.5 19H16.5C15 19 14.5 18.1 14.5 17V11C14.5 9.9 15 9 16.5 9H18.5C20 9 20.5 9.9 20.5 11Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  
    <!-- Spot Button -->
    <button class="btn hover:bg-slate-800 border-base-300 no-animation bg-slate-800 flex border items-center justify-center rounded-full grow" on:click={()=>{goto(`/spot`)}}> <!-- //pair.set({}) -->
      <span class="text-base-100"> {$_('spot_trading')} </span>
    </button>
  </div>
</div>