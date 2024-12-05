{#await $page.data.chart}
  <CoinChartLoader />
{:then dt}
  <div class="mt-3">
    <Chart {...chartOptions} ref={(ref) => (chartApi = ref)} {localization}>
      <LineSeries
        {...$ChartLineOption}
        data={dt.prices.map(([time, value]) => ({ time: time, value: formatChartPrice(value)})) || data}
        reactive={true}
        ref={(api) => (series = api)}
      />
    </Chart>
  </div>

  <div class="mt-2 grid grid-flow-row grid-cols-5 gap-4 px-4">
    {#each ranges as tab, i}
    <div class="flex justify-center">
      <button
        class={clsx(
          "btn min-w-8 w-12 btn-xs px-1 bg-base-100 focus:bg-base-200 hover:bg-base-200 border-none shadow-none rounded-md no-animation",
          $ChartActiveTab === i ? "bg-base-200" : "opacity-60",
        )}
        on:click={() => { tab.fn(); updateData(i) }}
      >
        {tab.name}
      </button>
    </div>
    {/each}
  </div>
{:catch _}
  <CoinChartLoader />
{/await}

<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { locale } from "svelte-i18n";
  import { formatChartPrice } from "$lib/helpers/utils";
  import { coinMarketChart } from "$lib/helpers/hufi/coin";
  import { Chart, LineSeries } from "svelte-lightweight-charts";
  import type { TokenChartTimeFrame } from "$lib/types/hufi/exchanges";
  import { coinChartOptions as chartOptions } from "$lib/helpers/chart";
  import CoinChartLoader from "$lib/components/skeleton/market/coinChartLoader.svelte";
  import { ChartActiveTab, ChartLineOption, ChartPrice, currentCoin, showCoinPrice } from "$lib/stores/market";

  onDestroy(()=>ChartActiveTab.set(0))
  $page.data.coin.then((c:unknown) => currentCoin.set(c))

  $: [] = [
    { time: "2018-10-19", value: 52.89 },
  ];

  const clickHandler = (param: unknown) => {
    if (!param.point) return;
    showCoinPrice.set(true);
  };
  const crossHandler = (param: unknown) => {
    if (!param.point) return;
    showCoinPrice.set(false);
    const data = Array.from(param.seriesData.values())[0];
    if (!data) return;
    ChartPrice.set(data);

    // console.log(`The time is ${param.time}. The data is:`, Array.from(param.seriesData.values())[0]);
  };

  let series: unknown;
  let chartApi: unknown;
  $: if (chartApi != undefined) {
    chartApi.timeScale().fitContent();
    chartApi.subscribeCrosshairMove(crossHandler);
    chartApi.subscribeClick(clickHandler);
  }
  $: localization = { locale: $locale?.slice(0, 2) || "en" };

  // Tabs
  let timeRange: TokenChartTimeFrame = "24h"
  const ranges = [
    // { name: $_("1hr"),  fn: () =>  timeRange = "1h" },
    { name: $_("24hr"), fn: () =>  timeRange = "24h" },
    { name: $_("1w"),   fn: () =>  timeRange = "1w" },
    { name: $_("1m"),   fn: () =>  timeRange = "1m" },
    { name: $_("1y"),   fn: () =>  timeRange = "1y" },
    { name: $_("all"),  fn: () =>  timeRange = "all" },
  ];

  const updateData =  async (i: number) => {
    ChartActiveTab.set(i);
    try {
      const data = await coinMarketChart($currentCoin.id.toLocaleLowerCase(), timeRange)
      if (data) {
        const map = data.prices.map(([time, value]: [number, string|number]) => ({ time: time, value: formatChartPrice(value)}))
        series.setData(map);
        chartApi.timeScale().fitContent();
      }
    } catch (e) {
      console.log(e);
    }
  };
</script>