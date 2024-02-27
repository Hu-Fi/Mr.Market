<script lang='ts'>
  import { page } from "$app/stores";
  import { socket } from "$lib/stores/spot";
  import { onDestroy, onMount } from "svelte";
  import Spot from "$lib/components/spot/spot.svelte";
	import { type PairsData } from '$lib/types/hufi/exchanges';
  import { connectOrderBook, switchSpotPair } from "$lib/helpers/hufi/socket";

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

<div>
  <Spot />
</div>