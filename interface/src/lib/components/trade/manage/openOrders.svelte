<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { currentPairOnly, openedOrders, orderFilterMode, pair } from "$lib/stores/trade";
  import SingleOrder from "$lib/components/trade/manage/singleOrder.svelte";
  import CancelOrder from "$lib/components/dialogs/manageOrder/cancelOrder.svelte";
  import CancelAllOrder from "$lib/components/dialogs/manageOrder/cancelAllOrder.svelte";
  import OrderFilter from "$lib/components/dialogs/manageOrder/orderFilter.svelte";

  $: os = [
    {
      first: "BTC",
      second: "USDT",
      price: 43576,
      exchange: "Binance",
      icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      time: "2019-10-12T07:20:50.52Z",
      type: "limit",
      buy: true,
      amount: "1",
      traded: "0.5342",
    },
    {
      first: "ETH",
      second: "USDT",
      price: 2353,
      exchange: "Binance",
      icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      time: "2019-10-12T07:20:50.52Z",
      type: "limit",
      buy: false,
      amount: "1",
      traded: "0.25234",
    },
    {
      first: "XIN",
      second: "USDT",
      price: 140,
      exchange: "Binance",
      icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      time: "2019-10-12T07:20:50.52Z",
      type: "limit",
      buy: true,
      amount: "1",
      traded: "0.823423",
    },
    {
      first: "XIN",
      second: "USDT",
      price: 140,
      exchange: "Binance",
      icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      time: "2019-10-12T07:20:50.52Z",
      type: "limit",
      buy: true,
      amount: "1",
      traded: "1",
    },
    {
      first: "XIN",
      second: "USDT",
      price: 140,
      exchange: "Binance",
      icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      time: "2019-10-12T07:20:50.52Z",
      type: "limit",
      buy: true,
      amount: "1",
      traded: "0",
    },
  ].filter((item) => {
    if ($currentPairOnly) {
      return (
        item.first.toUpperCase().match($pair.first.toUpperCase()) &&
        item.second.toUpperCase().match($pair.second.toUpperCase())
      )
    } else {
      return item
    }
  }).filter((item) => {
    switch($orderFilterMode) {
      case 0: return item.type === 'limit'
      case 1: return item.type === 'market'
      case 2: return item.type === 'advanced_limit'
      case 3: return item.type === 'tp' || item.type === 'sp'
    }
  })

  $: os, openedOrders.set(os.length)
</script>

<div class="flex flex-col space-y-2 mb-24 min-h-[80vh]">
  {#each os as o}
    <div class="p-4 border-b border-base-200">
      <SingleOrder {o} />
    </div>
  {/each}
  <CancelOrder />
  <CancelAllOrder />
  <OrderFilter />
</div>

<style>
</style>
