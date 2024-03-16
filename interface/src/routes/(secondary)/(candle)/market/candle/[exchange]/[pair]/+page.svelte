<script lang="ts">
  import { page } from "$app/stores";
  import { socket } from "$lib/stores/spot";
  import { onDestroy, onMount } from "svelte";
  import { CandleChart, CandleChartLoaded, CandleDetailTab, CandleOrderBookLoaded, CandlePriceLoaded } from "$lib/stores/market";
  import { fetchCandleChartData } from "$lib/helpers/candle/candle";
  import Price from "$lib/components/market/candle/price.svelte";
	import TimeRange from '$lib/components/dialogs/candle/timeRange.svelte';
  import KlineChart from "$lib/components/market/candle/klineChart.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte"
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
  import { connectCandleStick, switchCandleStickPair } from "$lib/helpers/hufi/socket";
	import IndicatorSettings from '$lib/components/dialogs/candle/indicatorSettings.svelte';
  import CandleStickPriceLoader from "$lib/components/skeleton/market/candleStickPriceLoader.svelte";
  import CandleStickChartLoader from "$lib/components/skeleton/market/candleStickChartLoader.svelte";
  import CandleStickDetailsTabLoader from "$lib/components/skeleton/market/candleStickDetailsTabLoader.svelte";
    import CandleStickOrderbookLoader from "$lib/components/skeleton/market/candleStickOrderbookLoader.svelte";

  const getRoutingParams = async () => {
    socket.set(connectCandleStick());
    // Load selector
    switchCandleStickPair($socket, {
      symbol: $page.data.pair,
      price: 0,
      exchange: $page.data.exchange,
    })
    // Load chart
    const candleStickChartData = await fetchCandleChartData();
    if (!candleStickChartData) {
      CandleChartLoaded.set(false);
      return;
    }
    $CandleChart.applyNewData();
  }
  onDestroy(() => {
    $socket.disconnect();
  });
  onMount(getRoutingParams)
</script>

<div>
  {#if $CandlePriceLoaded}
    <Price />
  {:else}
    <CandleStickPriceLoader />
  {/if}
  {#if $CandleChartLoaded}
    <KlineChart />
  {:else}
    <CandleStickChartLoader />
  {/if}
</div>

<div class="mt-4 mb-24 border-t-8 border-base-200">
  {#if $CandleOrderBookLoaded}
    <div class="flex flex-col">
      <DetailsTabs />
      {#if $CandleDetailTab === 0}
        <DetailsBook />
      {:else if $CandleDetailTab === 1}
        <DetailsTrades />
      {/if}
    </div>
  {:else}
    <div class="flex flex-col">
      <CandleStickDetailsTabLoader />
      <CandleStickOrderbookLoader />
    </div>
  {/if}
</div>

<TimeRange />
<IndicatorSettings />