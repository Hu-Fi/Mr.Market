<script lang="ts">
  import { onDestroy } from "svelte";
  import { socket } from "$lib/stores/trade";
  import { connectOrderBook } from "$lib/helpers/hufi/socket";
  import Orders from "$lib/components/trade/order/elements/orders.svelte";
  import Title from "$lib/components/trade/order/elements/title.svelte";
  import Tools from "$lib/components/trade/order/elements/tools.svelte";

  socket.set(connectOrderBook());
  onDestroy(() => {
    $socket.disconnect();
  });
</script>

<div class="flex flex-col space-y-2">
  <Title />
  <Orders />
  <Tools />
</div>