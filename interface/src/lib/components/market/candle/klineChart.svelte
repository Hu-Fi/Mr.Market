<script lang="ts">
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { onMount, onDestroy } from 'svelte'
  import { init, dispose } from "klinecharts";
	import { CandleChart } from '$lib/stores/market';
  import { fetchCandleChartData } from "$lib/helpers/candle/candle";
	import KlineTabs from '$lib/components/market/candle/klineTabs.svelte';
	import CoinChartLoader from '$lib/components/skeleton/market/coinChartLoader.svelte';

  const klineStyle = {
    candle: {
      tooltip:{ showRule: 'follow_cross', text: { family: 'Inter', size: 10 }, showType: 'rect' },
      priceMark: { high: { textFamily: 'Inter', textSize: 10 }, low: { textFamily: 'Inter', textSize: 10 }, last: { text: { family: 'Inter', size: 10 } } }
    },
    indicator: {
      tooltip: { showRule: 'always', text: { family: 'Inter', size: 10, marginTop: 0 }, showName: false, },
    },
    grid: { 
      horizontal: { show: false }, 
      vertical: { show: false },
    },
    crosshair: {
      horizontal: { text: { family: 'Inter', size: 10 } },
      vertical: { text: { family: 'Inter', size: 10 } },
    },
    xAxis: { axisLine: { show: false }, tickText: { family: 'Inter', size:10 } },
    yAxis: { axisLine: { show: false }, tickText: { family: 'Inter', size:10, marginStart: 1, marginEnd: 1 } },
  }
  onMount(async () => {
    CandleChart.set(init('chart'))
    $CandleChart.setStyles(klineStyle)
    $CandleChart.createIndicator({name:'MA', calcParams: [5, 10, 30]} , true, { id: 'candle_pane' })

    // Init chart
    const data = await fetchCandleChartData();
    $CandleChart.applyNewData(data);
  })
  onDestroy(() => {
    dispose('chart')
  })
</script>

{#await $page.data.chart}
  <CoinChartLoader />
{:then dt}
  <div class="flex flex-col space-y-4">
    <KlineTabs />
    <div id="chart" class="h-[300px] w-full select-none"/>
  </div>
{/await}