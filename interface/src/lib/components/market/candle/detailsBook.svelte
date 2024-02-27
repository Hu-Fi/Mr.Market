<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import colors from "tailwindcss/colors";
  import { theme } from "$lib/stores/theme";
  import { CandlePair } from "$lib/stores/market";
  import { formatDecimals } from "$lib/helpers/utils";
	import { CandleBids, CandleAsks } from '$lib/stores/market';
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
  
  const getBgWidthPercentage = (arr: number[], i: number) => {
    let max = Math.max(...arr)
    return (arr[i]/max)*100
  }

  $: BidsBgColor = $theme === 'dark' ? colors.emerald[900]: colors.green[100]
  $: AsksBgColor = $theme === 'dark' ? colors.rose[950]: colors.red[100]
</script>

<div class="flex flex-col space-y-3 px-4 mt-3">
  <div class="flex justify-between px-2 text-sm items-center">
    <!-- Buy -->
    <span class="font-medium text-xs opacity-60">{$_("buy")}</span>

    <!-- Sell -->
    <span class="font-medium opacity-60">{$_("sell")}</span>
  </div>

  <!-- Explain -->
  <div class="flex justify-between px-2 text-[10px] opacity-60">
    <span class="font-medium opacity-60">{$_("amount_", {values: {coin:$CandlePair.symbol.split('/')[0]}})}</span>
    <span class="font-medium opacity-60">{$_("price_", {values: {coin:$CandlePair.symbol.split('/')[1]}})}</span>
    <span class="font-medium opacity-60">{$_("amount_", {values: {coin:$CandlePair.symbol.split('/')[0]}})}</span>
  </div>
  
  <!-- Active Orders -->
  <div class="w-full grid grid-cols-2 text-xs">
    <!-- Buy -->
    <div class="flex flex-col">
      {#each $CandleBids as b, i}
        <div class="flex items-center justify-between p-2 bids" style="
          --bids-percentage: {getBgWidthPercentage($CandleBids.map((item)=>item.amount), i)+"%"};
          --bids-bg-color: {BidsBgColor};
        ">
          <span class={clsx("")}>
            {b.amount}
          </span>
          <span class={clsx(UpColorText, "opacity-60")}>
            {formatDecimals(b.price,2)}
          </span>
        </div>    
      {/each}
    </div>

    <!-- Sell -->
    <div class="flex flex-col">
      {#each $CandleAsks as s, i}
        <div class="flex items-center justify-between p-2 asks" style="
          --asks-percentage: {getBgWidthPercentage($CandleAsks.map((item)=>item.amount), i)+"%"};
          --asks-bg-color: {AsksBgColor};
        ">
          <span class={clsx(DownColorText, "opacity-60")}>
            {formatDecimals(s.price, 2)}
          </span>
          <span class={clsx("")}>
            {s.amount}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
.bids {
  background: linear-gradient(to left, var(--bids-bg-color) var(--bids-percentage), transparent var(--bids-percentage));
}
.asks {
  background: linear-gradient(to right, var(--asks-bg-color) var(--asks-percentage), transparent var(--asks-percentage));
}
</style>