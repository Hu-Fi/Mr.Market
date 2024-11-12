<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { MARKET_TOKEN_EXCHANGES } from "$lib/helpers/constants";
  import SinglePair from "$lib/components/market/token/singlePair.svelte";
  import CoinInfoLoader from "$lib/components/skeleton/market/coinInfoLoader.svelte";

  const tabs = [
    { title: $_("market"), fn: () => {} },
    // { title: $_("intro"), fn: () => {} },
  ];
  let activeTab = 0;

  $: statistics = [
    { key: $_("launch_date"), value: $page.data.coin.genesis_date },
    { key: $_("launch_price"), value: "1234" },
    { key: $_("ath"), value: "1234" },
    { key: $_("24h_volume"), value: "1234" },
    { key: $_("market_cap"), value: "1234" },
    { key: $_("circulating_supply"), value: "1234" },
  ]

  $: showItems=10
  $: console.log($page.data)
</script>

{#await $page.data.coin}
  <CoinInfoLoader />
{:then coin}
  <div class="mt-4 border-t-4 border-t-base-200">
    <div class="px-4 py-3 flex space-x-4 items-center justify-start">
      {#each tabs as t, i}
        <button
          on:click={() => {
            activeTab = i;
          }}
        >
          <span class={clsx(activeTab === i ? "opacity-100" : "opacity-60")}
            >{t.title}</span
          >
        </button>
      {/each}
    </div>
  </div>

  {#if activeTab === 0}
    <div class="flex flex-col space-y-6 mt-4 px-4">
      <!-- Title -->
      <div class="flex justify-between opacity-60">
        <span class="text-xs">
          {$_("pairs")}
        </span>
        <span class="text-xs">
          {$_("price")}
        </span>
      </div>

      <!-- Pairs -->
      {#each coin.tickers
        .sort((a, b) => {
          const aa = MARKET_TOKEN_EXCHANGES.includes(a.market.identifier);
          const bb = MARKET_TOKEN_EXCHANGES.includes(b.market.identifier);
          return (bb - aa);
        })
        .slice(0, showItems) as pair}
        <SinglePair {pair} />
      {/each}

      {#if showItems < coin.tickers.length}
        <div class="flex justify-center items-center opacity-60">
          <button class="btn btn-xs bg-base-100 border-base-300 hover:bg-base-100 hover:border-base-300 no-animation flex items-center justify-center focus:bg-base-100 focus:border-base-300 rounded-2xl" on:click={()=>showItems+=10}> {$_('show_more')} </button>
        </div>
      {/if}
    </div>
  {:else if activeTab === 1}
    <div class="flex flex-col space-y-8 mt-4 px-4">
      <!-- Statistics -->
      <div class="grid grid-cols-2">
        {#each statistics as s}
          <div class="flex flex-col text-xs py-2 space-y-1">
            <span class="opacity-70">
              {s.key}
            </span>
            <span class="font-bold">
              {s.value}
            </span>
          </div>
        {/each}
      </div>

      <div class="flex flex-col space-y-4">
        <!-- Title -->
        <span class="font-bold text-lg">
          {$_("about_coin", { values: { coin: coin.symbol.toUpperCase() } })}
        </span>
        <span class="font-light text-sm">
          {coin.description.en}
        </span>
      </div>
    </div>
  {/if}
{:catch _}
    <CoinInfoLoader />
{/await}

<style>
</style>
