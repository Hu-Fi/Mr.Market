<script lang="ts">
  import clsx from 'clsx';
  import { _ } from "svelte-i18n"
  import type { CandleTabs, SupportedTimeFrame } from '$lib/types/hufi/exchanges';
	import { CandleTimeRange, CandleTimeRangeDialog, CandleIndicatorDialog, fetchCandleChartData, CandleChart } from '$lib/stores/market';

  let ranges: CandleTabs = [
    { k: $_("15m"),v: '15m'},
    { k: $_("1h"), v: '1h'},
    { k: $_("4h"), v: '4h'},
    { k: $_("1d"), v: '1d'},
  ];
  const setTimeFrame = async (timeFrame: SupportedTimeFrame) => {
    CandleTimeRange.set(timeFrame);
    await loadChart();
  }
  const loadChart = async () => {
    const data = await fetchCandleChartData();
    $CandleChart.applyNewData(data);
  }
</script>

<div class="flex px-2 mt-2 items-center space-x-2">
  <div class="grid grid-flow-row grid-cols-4 gap-0">
    {#each ranges as tab}
      <button
        class={clsx(
          "btn min-w-8 w-12 btn-xs px-1 bg-base-100 border-none shadow-none no-animation hover:bg-base-200 focus:bg-base-200 focus:border-none rounded-md ",
          $CandleTimeRange.v === tab.v ? "bg-base-200 text-base-content" : "opacity-60",
        )}
        on:click={() => {
          CandleTimeRange.set(tab)
          setTimeFrame(tab);
        }}
      >
        {tab.k}
      </button>
    {/each}
  </div>
    
  <!-- More button -->
  <button class={clsx("flex btn min-w-8 space-x-[-8px] opacity-60 w-14 btn-xs bg-base-100 shadow-none border-none no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none rounded-md px-0",
    ranges.every(range => range.v !== $CandleTimeRange.v) ? "bg-base-200 text-base-content opacity-100" : "" )} on:click={()=>{CandleTimeRangeDialog.set(!$CandleTimeRangeDialog)}}>
    <span> 
      { ranges.some(range => range.v === $CandleTimeRange.v) ? $_('more') : $CandleTimeRange.k } 
    </span>
    {#if $CandleTimeRangeDialog}
      <!-- Caret Up Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={"currentColor"}></path></svg>
    {:else}
      <!-- Caret Down Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={"currentColor"}></path></svg>
    {/if}
  </button>

  <!-- Indicator button -->
  <button class="flex btn min-w-8 space-x-[-8px] opacity-60 btn-xs bg-base-100 shadow-none border-none rounded-md px-1 no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none" on:click={()=>{CandleIndicatorDialog.set(!$CandleIndicatorDialog)}}>
    <span> {$_('indicators')} </span>
    {#if $CandleIndicatorDialog}
      <!-- Caret Up Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill={"currentColor"}></path></svg>
    {:else}
      <!-- Caret Down Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill={"currentColor"}></path></svg>
    {/if}
  </button>
</div>
