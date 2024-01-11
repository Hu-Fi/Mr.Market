<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";

  export let pair = {first: "BTC", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"}
</script>

<button class="flex items-center justify-between w-full p-4" on:click={()=>{console.log(`goto ${pair.first}/${pair.second}`)}}>
  <div class="flex space-x-3 items-center">
    <!-- Icon -->
    <img class="w-8 h-8" src={pair.icon} alt={pair.name} />

    <!-- Title -->
    <div class="flex flex-col text-start">
      <div>
        <span class="text-md font-semibold">{pair.first}</span><span class="text-xs opacity-50">/{pair.second}</span>
      </div>
      <span class="text-xs opacity-40 capitalize">
        {pair.exchange}
      </span>
    </div>
  </div>


  <!-- Price -->
  <div class="flex items-center space-x-2">
    <div>
      <span class="text-xs font-semibold">
        {formatUSMoney(pair.price)}
      </span>
    </div>

    <!-- Price change -->
    <div class="w-20 flex items-center justify-end">
      <div class={clsx("min-w-14 h-7 flex justify-center items-center rounded-md px-2", pair.percentage > 0 ? UpColorBg : DownColorBg)}>
        <span class="text-center text-xs font-extrabold text-base-100">
          {formatDecimals(pair.percentage,2)}%
        </span>
      </div>
    </div>
  </div>
</button>

<style>
</style>
