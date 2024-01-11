<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import colors from "tailwindcss/colors";
  import { theme } from "$lib/stores/theme";
  import { formatDecimals } from "$lib/helpers/utils";
  import { DownColorText, UpColorBg, UpColorText } from "$lib/helpers/constants";
  import { CandleDetailBookDecimal, CandleDetailBookDecimalDialog, CandlePair, } from "$lib/stores/market";
  

  const activeBuys = [
    { price: $CandlePair.price, amount: 0.1224 },
    { price: $CandlePair.price, amount: 0.0624 },
    { price: $CandlePair.price, amount: 0.0724 },
    { price: $CandlePair.price, amount: 0.6224 },
    { price: $CandlePair.price, amount: 0.0924 },
    { price: $CandlePair.price, amount: 2.3212 },
    { price: $CandlePair.price, amount: 6.3224 },
    { price: $CandlePair.price, amount: 3.3624 },
    { price: $CandlePair.price, amount: 1.0624 },
    { price: $CandlePair.price, amount: 3.0624 }
  ]
  const activeSells = [
    { price: $CandlePair.price, amount: 2.3212 },
    { price: $CandlePair.price, amount: 6.3224 },
    { price: $CandlePair.price, amount: 3.3624 },
    { price: $CandlePair.price, amount: 1.0624 },
    { price: $CandlePair.price, amount: 3.0624 },
    { price: $CandlePair.price, amount: 0.1224 },
    { price: $CandlePair.price, amount: 0.0624 },
    { price: $CandlePair.price, amount: 0.0724 },
    { price: $CandlePair.price, amount: 0.6224 },
    { price: $CandlePair.price, amount: 0.0924 },
  ]

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

    <!-- Precision selector -->
    <!-- <button class="btn btn-xs btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content rounded-md text-start justify-between px-2 no-animation" on:click={()=>{CandleDetailBookDecimalDialog.set(true)}}>
      <span class="">
        {$CandleDetailBookDecimal}
      </span>
      {#if !$CandleDetailBookDecimalDialog}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
      {/if}
    </button> -->

    <!-- Sell -->
    <span class="font-medium opacity-60">{$_("sell")}</span>
  </div>

  <!-- Explain -->
  <div class="flex justify-between px-2 text-[10px] opacity-60">
    <span class="font-medium opacity-60">{$_("amount_", {values: {coin:$CandlePair.first}})}</span>
    <span class="font-medium opacity-60">{$_("price_", {values: {coin:$CandlePair.second}})}</span>
    <span class="font-medium opacity-60">{$_("amount_", {values: {coin:$CandlePair.first}})}</span>
  </div>
  
  <!-- Active Orders -->
  <div class="w-full grid grid-cols-2 text-sm">
    <!-- Buy -->
    <div class="flex flex-col">
      {#each activeBuys as b, i}
        <div class="flex items-center justify-between p-2 bids" style="
          --bids-percentage: {getBgWidthPercentage(activeBuys.map((item)=>item.amount), i)+"%"};
          --bids-bg-color: {BidsBgColor};
        ">
          <span class={clsx("")}>
            {b.amount}
          </span>
          <span class={clsx(UpColorText, "")}>
            {formatDecimals(b.price,1)}
          </span>
        </div>    
      {/each}
    </div>

    <!-- Sell -->
    <div class="flex flex-col">
      {#each activeSells as s, i}
      <div class="flex items-center justify-between p-2 asks" style="
        --asks-percentage: {getBgWidthPercentage(activeSells.map((item)=>item.amount), i)+"%"};
        --asks-bg-color: {AsksBgColor};
      ">
          <span class={clsx(DownColorText, "")}>
            {formatDecimals(s.price, 1)}
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