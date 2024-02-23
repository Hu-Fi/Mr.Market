<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { socket } from "$lib/stores/trade";
  import { onDestroy, onMount } from "svelte";
  import { CandleDetailTab, CandlePair } from "$lib/stores/market";
  import type { SupportedPairs } from "$lib/types/hufi/exchanges";
  import Price from "$lib/components/market/candle/price.svelte";
	import TimeRange from '$lib/components/dialogs/candle/timeRange.svelte';
  import KlineChart from "$lib/components/market/candle/klineChart.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte"
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
  import { SUPPORTED_EXCHANGES, SUPPORTED_UNIQUE_PAIRS } from "$lib/helpers/constants";
  import { connectCandleStick, switchCandleStickPair } from "$lib/helpers/hufi/socket";
	import IndicatorSettings from '$lib/components/dialogs/candle/indicatorSettings.svelte';

  const getRoutingParams = () => {
    socket.set(connectCandleStick());
    if (!$page.data.exchange && !$page.data.pair) {
      return
    }
    const pair = String($page.data.pair).replace('-', "/");
    if (!SUPPORTED_EXCHANGES.includes($page.data.exchange)) {
      console.log('Unsupported exchange')
      goto('/market/candle/binance/BTC-USDT')
      return
    }
    if (!SUPPORTED_UNIQUE_PAIRS.includes(pair)) {
      console.log('Unsupported pair')
      goto('/market/candle/binance/BTC-USDT')
      return
    }
    switchCandleStickPair($socket, {
      symbol: pair as SupportedPairs,
      price: 0,
      exchange: $page.data.exchange,
    })
  }
  onDestroy(() => {
    $socket.disconnect();
  });
  onMount(getRoutingParams)
</script>

<div>
  <Price />
  <KlineChart />
</div>

<div class="mt-4 mb-24 border-t-8 border-base-200">
  <div class="flex flex-col">
    <DetailsTabs />
    {#if $CandleDetailTab === 0}
      <DetailsBook />
    {:else if $CandleDetailTab === 1}
      <DetailsTrades />
    {/if}
  </div>
</div>

<TimeRange />
<IndicatorSettings />