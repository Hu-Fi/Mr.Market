<script lang="ts">
  import { onMount } from "svelte";
  import { fetchAllOrders } from "$lib/helpers/hufi/admin/orders";
  import Spot from "$lib/components/admin/orders/spotOrders.svelte";
  import ArbitrageOrders from "$lib/components/admin/orders/arbitrageOrders.svelte";
  import MarketMakingOrders from "$lib/components/admin/orders/marketMakingOrders.svelte";
  import SimplyGrowOrders from "$lib/components/admin/orders/simplyGrowOrders.svelte";
  
  onMount(()=>{
    const token = localStorage.getItem('admin-access-token')
    if (!token){
      return;
    }
    fetchAllOrders(token).then(res=>{
      console.log(res)
    })
  })
</script>

<div class="flex flex-col space-y-8 p-8">
  <Spot />
  <ArbitrageOrders />
  <MarketMakingOrders />
  <SimplyGrowOrders />
</div>