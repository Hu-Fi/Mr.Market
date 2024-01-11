<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import emptyToken from "$lib/images/empty-token.svg"
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import { ChartActiveTab, ChartPrice, showCoinPrice } from "$lib/stores/market";
  import CoinTitleLoader from "$lib/components/skeleton/market/coinTitleLoader.svelte";
  import { formatDecimals, formatTimestampToTime, formatUSMoney } from "$lib/helpers/utils";

  onMount(()=>showCoinPrice.set(true))
</script>

{#await $page.data.coin}
  <CoinTitleLoader />
{:then coin}
  <div class="flex flex-col space-y-4 mx-4">
    <!-- Icon and Title -->
    <div class="flex space-x-2 items-center">
      <img src={findCoinIconBySymbol(coin.symbol.toUpperCase()) || coin.image.thumb || emptyToken} alt={coin.symbol} class="w-6 h-6" >
      <span class="font-bold text-xl uppercase">
        {coin.symbol}
      </span>
      <span class="font-bold text-xl opacity-40">
        {coin.name}
      </span>
    </div>

    {#if $showCoinPrice}
      <!-- Latest Price -->
      <div>
        <span class="font-extrabold text-3xl">
          {formatUSMoney(coin.market_data.current_price.usd)}
        </span>
      </div>
      <!-- Change percentage and change usd -->
      <div class="!mt-1 flex space-x-3">
        <span class={clsx(Number(coin.market_data.price_change_24h) > 0 ? "text-green-400":"text-red-400")}>
          {(Number(coin.market_data.price_change_24h) >= 0 ? "+":"")}{ formatDecimals(coin.market_data.market_cap_change_percentage_24h, 2) }%
        </span>
        {#if Number(coin.market_data.price_change_24h) != 0}
          <span class={clsx(Number(coin.market_data.price_change_24h) > 0 ? "text-green-400":"text-red-400")}>
            {(Number(coin.market_data.price_change_24h) >= 0 ? "+":"") + Number(formatDecimals(coin.market_data.price_change_24h,2))}
            <!-- {(Number(coin.market_data.price_change_24h) >= 0 ? "+":"") + formatUSMoney(BN(coin.current_price).multipliedBy(Number(coin.market_data.price_change_24h)/100).toFixed(2))} -->
          </span>
        {/if}
      </div>
    {:else}
      <!-- Chart Price -->
      <div>
        <span class="font-extrabold text-3xl">
          {formatUSMoney($ChartPrice.value)}
        </span>
      </div>
      <!-- Date -->
      <!-- TODO: format time by country -->
      <div class="!mt-1 flex space-x-3">
        <span class={"text-base-content text-md opacity-50"}>
          { $ChartActiveTab <= 2 ? formatTimestampToTime($ChartPrice.time, true) : formatTimestampToTime($ChartPrice.time) }
        </span>
      </div>
    {/if}
  </div>
{:catch error}
  <CoinTitleLoader />
{/await}