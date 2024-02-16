<script lang="ts">
  import { CandleDetailTab } from "$lib/stores/market";
  import { connectCandleStick } from "$lib/helpers/hufi/socket";
  import Price from "$lib/components/market/candle/price.svelte";
	import TimeRange from '$lib/components/dialogs/candle/timeRange.svelte';
  import KlineChart from "$lib/components/market/candle/klineChart.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte"
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
	import IndicatorSettings from '$lib/components/dialogs/candle/indicatorSettings.svelte';
  import DetailsDepth from "$lib/components/market/candle/detailsDepth.svelte";
  import { onDestroy } from "svelte";
  import { socket } from "$lib/stores/trade";

  socket.set(connectCandleStick());
  onDestroy(() => {
    $socket.disconnect();
  });
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
    <!-- {:else if $CandleDetailTab === 1}
      <DetailsDepth /> -->
    {:else if $CandleDetailTab === 1}
      <DetailsTrades />
    {/if}
  </div>
</div>

<TimeRange />
<IndicatorSettings />