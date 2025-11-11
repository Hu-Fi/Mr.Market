<script lang="ts">
  import { goto } from "$app/navigation";
  import { page as dPage } from "$app/stores";
  import ChooseExchange from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchange.svelte";
  import ChooseExchangeSmallBtn from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchangeSmallBtn.svelte";
  import SearchExchange from "$lib/components/grow/marketMaking/createNew/exchange/searchBtn.svelte";
  import ChooseTradingPair from "$lib/components/grow/marketMaking/createNew/tradingPair/chooseTradingPair.svelte";
  import ChooseTradingPairSmallBtn from "$lib/components/grow/marketMaking/createNew/tradingPair/chooseTradingPairSmallBtn.svelte";

  // Load supported exchanges for market making in +page.ts
  const supportedMarketMakingExchanges = [
    "binance",
    "bybit",
    "kucoin",
    "okx",
    "huobi",
    "mexc",
  ];

  const selectExchange = (exchangeName: string) => {
    const newUrl = new URL($dPage.url);
    newUrl.searchParams.set("exchange", exchangeName);
    const newPath = newUrl.pathname + newUrl.search;
    goto(newPath, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const selectTradingPair = (tradingPair: string) => {
    const newUrl = new URL($dPage.url);
    newUrl.searchParams.set("trading_pair", tradingPair);
    const newPath = newUrl.pathname + newUrl.search;
    goto(newPath, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };
  
  $: exchangeName = $dPage.url.searchParams.get("exchange");
  $: tradingPair = $dPage.url.searchParams.get("trading_pair");
</script>

{#if !exchangeName}
  <div class="flex flex-col items-center flex-grow h-[100vh-64px] mt-32">
    <div class="text-center">
      <ChooseExchange />
    </div>
    <div
      class="mx-4 mt-12 gap-6 grid grid-cols-2 bg-white bg-gradient-radial from-sky-100 via-white to-white"
    >
      {#each supportedMarketMakingExchanges as exchangeName}
        <ChooseExchangeSmallBtn {exchangeName} onClick={() => selectExchange(exchangeName)} />
      {/each}
    </div>
  </div>

  <div class="absolute bottom-28 w-full flex justify-center">
    <SearchExchange onSearch={() => {}} />
  </div>

{:else if !tradingPair}
  <div class="flex flex-col items-center flex-grow h-[100vh-64px] mt-32">
    <div class="text-center">
      <ChooseTradingPair />
    </div>
    <div
      class="mx-4 mt-12 gap-6 grid grid-cols-2 bg-white bg-gradient-radial from-sky-100 via-white to-white"
    >
      {#each supportedMarketMakingExchanges as exchangeName}
        <ChooseTradingPairSmallBtn {exchangeName} onClick={() => selectTradingPair(exchangeName)} />
      {/each}
    </div>
  </div>

  <div class="absolute bottom-28 w-full flex justify-center">
    <SearchExchange onSearch={() => {}} />
  </div>
{/if}