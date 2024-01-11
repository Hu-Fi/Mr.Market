<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import Chart from "$lib/components/market/candle/chart.svelte";
  import Price from "$lib/components/market/candle/price.svelte";
  import DetailsTabs from "$lib/components/market/candle/detailsTabs.svelte";
  import DetailsTrades from "$lib/components/market/candle/detailsTrades.svelte";
  import DetailsDepth from "$lib/components/market/candle/detailsDepth.svelte";
  import DetailsBook from "$lib/components/market/candle/detailsBook.svelte"
  import { CandleDetailTab } from "$lib/stores/market";
</script>

<div>
  <Price />
  <Chart />
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
