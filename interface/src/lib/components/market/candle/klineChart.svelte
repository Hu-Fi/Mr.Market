<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from 'svelte'
  import { init, dispose } from "klinecharts";
	import KlineTabs from '$lib/components/market/candle/klineTabs.svelte';
	import { CandleChart, CandleChartLoaded, CandleNewData } from '$lib/stores/market';
  import CandleStickChartLoader from "$lib/components/skeleton/market/candleStickChartLoader.svelte";

  const klineStyle = {
    candle: {
      // bar: { upColor: colors.green['500'], downColor: colors.red['500'], upBorderColor: colors.green['500'], downBorderColor: colors.red['500'], upWickColor: colors.green['500'], downWickColor: colors.red['500'] },
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
    const chart = init('chart')
    if (chart === null || !chart){
      return;
    }
    CandleChart.set(chart)
    $CandleChart.setStyles(klineStyle)
    $CandleChart.createIndicator({name:'MA', calcParams: [5, 10, 30]} , true, { id: 'candle_pane' })
    $CandleChart.setMaxOffsetLeftDistance(100)
    $CandleChart.setMaxOffsetRightDistance(100)
  })
  onDestroy(() => {
    dispose('chart')
  })

  const updateData = () => {
    const dataList = $CandleChart.getDataList()
    const data0 = dataList[0]
    const data1 = dataList[1]
    if (!data0 || !data1) {
      return
    }
    const gap = data1.timestamp - data0.timestamp
    const last1 = dataList[dataList.length - 1]
    if (!last1) {
      return
    }
    let newData = {...$CandleNewData}
    if (newData.timestamp - last1.timestamp < gap) {
      newData.timestamp = last1.timestamp
    } else {
      newData.timestamp = last1.timestamp + gap
    }
    $CandleChart.updateData(newData);
  }
  $: if ($CandleChartLoaded && $CandleNewData != undefined){
    updateData()
  }
</script>

{#await $page.data.chart}
  <CandleStickChartLoader />
{:then _}
  <div class="flex flex-col space-y-4">
    <KlineTabs />
    <div id="chart" class="h-[300px] w-full select-none"/>
  </div>
{/await}