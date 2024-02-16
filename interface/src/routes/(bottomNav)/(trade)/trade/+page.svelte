<script>
  import { onDestroy } from "svelte";
  import { socket } from "$lib/stores/trade";
  import { connectOrderBook } from "$lib/helpers/hufi/socket";
  import Trade from "$lib/components/trade/trade.svelte";

  socket.set(connectOrderBook());
  onDestroy(() => {
    $socket.disconnect();
  });
</script>

<div>
  <Trade />
</div>