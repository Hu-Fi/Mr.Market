<script lang="ts">
  import clsx from "clsx"
  import moment from "moment"
  import { _ } from "svelte-i18n"
  import { cancelOrder } from "$lib/stores/trade";
  import { formatDecimals } from "$lib/helpers/utils";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";

  export let o = {
    first: "BTC", 
    second: "USDT", 
    price: 43576,
    exchange: "Binance",
    icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
    time: "2019-10-12T07:20:50.52Z", 
    type: "limit",
    buy: true,
    amount: "1",
    traded: "0.5",
  };
  const go = () => {
    console.log('goto open order')
  }
</script>

<div class="flex flex-col space-y-3">
  <!-- Title -->
  <div class="flex justify-between">
    <button class="flex items-center space-x-1" on:click={()=>{go()}}>
      <img src={o.icon} alt="icon" loading="lazy" class="w-4 h-4" />
      <span class="font-semibold"> 
        {o.first}/{o.second}
      </span>
      <!-- Chevron right Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-xs opacity-60" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
    </button>

    <div class="flex space-x-4">
      <button class="btn btn-xs rounded-full no-animation" on:click={()=>{cancelOrder(o)}}>
        <span class="text-xs opacity-80"> {$_('cancel_order')} </span>
      </button>
    </div>
  </div>

  <button class="flex flex-col space-y-3" on:click={()=>{go()}}>
    <!-- Info and time -->
    <div class="flex items-center justify-between w-full">
      <div class="flex space-x-2">
        <div class={clsx("bg-red-100 px-2 rounded-md")}>
          <span class={clsx("text-red-500 text-sm capitalize")}>{o.type}</span>
        </div>
        <div class={clsx(o.buy ? "bg-green-100": "bg-red-100" ,"px-2 rounded-md")}>
          <span class={clsx(o.buy ? "text-green-500": "text-red-500" ,"text-sm capitalize")}>{o.buy ? $_('buy'): $_('sell')}</span>
        </div>
      </div>

      <div>
        <span class="text-xs opacity-60"> {moment(o.time).format('MMMM Do YYYY, h:mm:ss a')} </span>
      </div>
    </div>

    <!-- Amount and price -->
    <div class="flex space-x-4 justify-between w-full">
      <!-- Circle progress -->
      <div class={clsx("radial-progress border border-base-300", o.buy ? UpColorText : DownColorText)} style={`--value:${formatDecimals(o.traded/o.amount*100, 0)}; --size: 44px; --thickness: 2px;`} role="progressbar">
        <span class="text-sm text-base-content">{formatDecimals(o.traded/o.amount*100, 1)}%</span> 
      </div>
      
      <!-- Price -->
      <div class="flex flex-col justify-center space-y-2">
        <div class="flex items-center text-xs space-x-2 justify-between">
          <span class="opacity-50">
            {$_('amount')}
          </span>
          <span class="">
            {o.traded}/{o.amount}
          </span>
        </div>
        <div class="flex items-center text-xs space-x-2 justify-between">
          <span class="opacity-50">
            {$_('price')}
          </span>
          <span class="">
            {o.price}
          </span>
        </div>
      </div>
    </div>
  </button>
  
</div>

<style>

</style>