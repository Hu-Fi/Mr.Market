<script>
  import { page } from "$app/state";
  import ChooseExchange from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchange.svelte";
  import ChooseExchangeSmallBtn from "$lib/components/grow/marketMaking/createNew/exchange/chooseExchangeSmallBtn.svelte";

  // Load supported exchanges for market making in +page.ts
  const supportedMarketMakingExchanges = [
    'binance',
    'bybit',
    'kucoin',
    'okx',
    'huobi',
    'mexc'
  ];
</script>

<div class="flex flex-col items-center flex-grow h-[100vh-64px] mt-32">
  <div class="text-center">
    <ChooseExchange />
  </div>
  <div class="mx-4 mt-12 gap-6 grid grid-cols-2  bg-white bg-gradient-radial from-sky-100 via-white to-white">
    {#each supportedMarketMakingExchanges as exchangeName}
      <ChooseExchangeSmallBtn exchangeName={exchangeName} />
    {/each}
  </div>
</div>