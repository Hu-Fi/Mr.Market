<script lang="ts">
  import { page } from "$app/stores";
  import { socket } from "$lib/stores/spot";
  import { onDestroy, onMount } from "svelte";
  import { CandleChart, CandleDetailTab } from "$lib/stores/market";
  import { fetchCandleChartData } from "$lib/helpers/candle/candle";
  import Price from "$lib/components/market/candle/price.svelte";
	import TimeRange from '$lib/components/dialogs/candle/timeRange.svelte';
  import KlineChart from "$lib/components/market/candle/klineChart.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte"
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
  import { connectCandleStick, switchCandleStickPair } from "$lib/helpers/hufi/socket";
	import IndicatorSettings from '$lib/components/dialogs/candle/indicatorSettings.svelte';

  const getRoutingParams = async () => {
    socket.set(connectCandleStick());
    // Load selector
    switchCandleStickPair($socket, {
      symbol: $page.data.pair,
      price: 0,
      exchange: $page.data.exchange,
    })
    // Load chart
    $CandleChart.applyNewData(await fetchCandleChartData());
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