<script lang="ts">
  import clsx from "clsx";
  import { darkTheme } from "$lib/stores/theme";
  import { manageMode } from "$lib/stores/trade";
  import OrderConfirm from "$lib/components/dialogs/orderConfirm.svelte";
  import Button from "$lib/components/trade/bids/button.svelte";
  import BuyNSell from "$lib/components/trade/bids/buyNsell.svelte";
  import Inputs from "$lib/components/trade/bids/inputs.svelte";
  import OrderSelector from "$lib/components/trade/bids/orderSelector.svelte";
  import OpenOrders from "$lib/components/trade/manage/openOrders.svelte";
  import OpenPositions from "$lib/components/trade/manage/openPositions.svelte";
  import Sub from "$lib/components/trade/manage/sub.svelte";
  import Tabs from "$lib/components/trade/manage/tabs.svelte";
  import OrderBook from "$lib/components/trade/order/orderBook.svelte";
</script>

<!-- Trading -->
<div class="flex space-x-4 px-4">
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
<div class={clsx("mt-4 border-t-[12px]", $darkTheme ? "border-slate-900" : "border-slate-100")}>
  <div class="flex flex-col">
    <Tabs />
    <Sub />
    {#if $manageMode === 0}
      <OpenOrders />
    {:else if $manageMode === 1}
      <OpenPositions />
    {/if}
  </div>
</div>
