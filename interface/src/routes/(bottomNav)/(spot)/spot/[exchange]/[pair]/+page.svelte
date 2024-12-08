<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";
  import { socket } from "$lib/stores/spot";
  import { onDestroy, onMount } from "svelte";
  import { darkTheme } from "$lib/stores/theme";
  import { manageMode } from "$lib/stores/spot";
	import { type PairsData } from '$lib/types/hufi/exchanges';
  import { connectOrderBook, switchSpotPair } from "$lib/helpers/hufi/socket";

  import OrderConfirm from "$lib/components/dialogs/orderConfirm.svelte";
  import Button from "$lib/components/spot/bids/button.svelte";
  import BuyNSell from "$lib/components/spot/bids/buyNsell.svelte";
  import Inputs from "$lib/components/spot/bids/inputs.svelte";
  import OrderSelector from "$lib/components/spot/bids/orderSelector.svelte";
  import OpenOrders from "$lib/components/spot/manage/openOrders.svelte";
  import OpenPositions from "$lib/components/spot/manage/openPositions.svelte";
  import Tabs from "$lib/components/spot/manage/tabs.svelte";
  import OrderBook from "$lib/components/spot/order/orderBook.svelte";

  const getRoutingParams = async () => {    
    socket.set(connectOrderBook());
    
    switchSpotPair($socket, { 
      symbol: $page.data.pair,
      price: 0,
      exchange: $page.data.exchange,
    } as PairsData)
  }
  onDestroy(() => {
    $socket.disconnect();
  });
  onMount(getRoutingParams)
</script>

<!-- Trading -->
<div class="flex space-x-4 p-4">
  <div class="flex flex-col space-y-2 w-full">
    <BuyNSell />
    <OrderSelector />
    <Inputs />
    <Button />
  </div>
  <div class="w-48">
    <OrderBook />
  </div>
</div>
<OrderConfirm />

<!-- Orders -->
<div class={clsx("border-t", $darkTheme ? "border-slate-900" : "border-base-200")}>
  <div class="flex flex-col">
    <Tabs />
    {#if $manageMode === 0}
      <OpenOrders />
    {:else if $manageMode === 1}
      <OpenPositions />
    {/if}
  </div>
</div>