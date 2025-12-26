<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { socket } from "$lib/stores/spot";
  import { onDestroy, onMount } from "svelte";
  import { fetchCandleChartData } from "$lib/helpers/candle/candle";
  import Price from "$lib/components/market/candle/price.svelte";
  import TimeRange from "$lib/components/dialogs/candle/timeRange.svelte";
  import KlineChart from "$lib/components/market/candle/klineChart.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte";
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
  import {
    connectCandleStick,
    switchCandleStickPair,
  } from "$lib/helpers/mrm/socket";
  import IndicatorSettings from "$lib/components/dialogs/candle/indicatorSettings.svelte";
  import CandleStickPriceLoader from "$lib/components/skeleton/market/candleStickPriceLoader.svelte";
  import CandleStickDetailsTabLoader from "$lib/components/skeleton/market/candleStickDetailsTabLoader.svelte";
  import CandleStickOrderbookLoader from "$lib/components/skeleton/market/candleStickOrderbookLoader.svelte";
  import {
    CandleChart,
    CandleChartLoaded,
    CandleDetailTab,
    CandleLoadingFailed,
    CandleOrderBookLoaded,
    CandlePairSelectorDialog,
    CandlePriceLoaded,
  } from "$lib/stores/market";

  const getRoutingParams = async () => {
    socket.set(connectCandleStick());
    // Load selector
    switchCandleStickPair($socket, {
      symbol: $page.data.pair,
      price: 0,
      exchange: $page.data.exchange,
    });
    // Load chart
    let candleStickChartData;
    try {
      candleStickChartData = await fetchCandleChartData();
    } catch (e) {
      CandleLoadingFailed.set(true);
    }
    if (!candleStickChartData) {
      CandleLoadingFailed.set(true);
      CandleChartLoaded.set(false);
      return;
    }
    if (!$CandleChart) {
      console.error("CandleChart undefined");
      return;
    }
    $CandleChart.applyNewData(candleStickChartData);
  };
  onDestroy(() => {
    $socket.disconnect();
  });
  onMount(getRoutingParams);
</script>

{#if $CandleLoadingFailed}
  <div class="flex flex-col items-center justify-center my-72 mx-8 space-y-4">
    <span class="text-lg"> {$_("failed_to_load_candle_stick")} </span>
    <button
      class="btn btn-sm no-animation"
      on:click={() => {
        CandlePairSelectorDialog.set(true);
      }}
    >
      <span> {$_("switch_pair")} </span>
    </button>
  </div>
{:else}
  <div>
    {#if $CandlePriceLoaded}
      <Price />
    {:else}
      <CandleStickPriceLoader />
    {/if}
    <KlineChart />
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
{/if}

<TimeRange />
<IndicatorSettings />
