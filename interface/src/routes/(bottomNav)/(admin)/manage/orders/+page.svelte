<script lang="ts">
  // import Swap from "$lib/components/admin/orders/swap.svelte";
  import Spot from "$lib/components/admin/orders/spot.svelte";
  import ArbitrageOrders from "$lib/components/admin/orders/arbitrageOrders.svelte";
  import MarketMakingOrders from "$lib/components/admin/orders/marketMakingOrders.svelte";
</script>

<div class="flex flex-col space-y-8 p-8">
  <Spot />
  <!-- <Swap /> -->
   <ArbitrageOrders />
   <MarketMakingOrders />
</div>