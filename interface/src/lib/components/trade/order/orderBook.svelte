<script lang="ts">
  import { io } from "socket.io-client";
  import { onDestroy } from "svelte";
  import type { Socket } from "socket.io-client";
  import { asks, bids, orderBookLoaded, pair } from "$lib/stores/trade";
  import { HUFI_SOCKET_URL } from "$lib/helpers/constants";
  import Orders from "$lib/components/trade/order/elements/orders.svelte";
  import Title from "$lib/components/trade/order/elements/title.svelte";
  import Tools from "$lib/components/trade/order/elements/tools.svelte";
  import { decodeOrderBook } from "$lib/helpers/hufi/marketDataDecoder";

  const connectOrderBook = () => {
    let socket: Socket;
    // Initialize the socket connection if it's not already established

    socket = io(
      `http://bc6e1fa0-3c5a-4235-809c-c4fcc4a5d859.mvg.fi:3012/marketdata`,
    );

    socket.on("connect", () => {
      socket.emit("subscribeOrderBook", {
        exchange: "binance",
        symbol: "BTC/USDT",
      });
      orderBookLoaded.set(true);
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("orderBookData", (data) => {
      decodeOrderBook("binance", data);
    });

    return socket;
  };
  const socket = connectOrderBook();
  onDestroy(() => {
    socket.disconnect();
  });
</script>

<div class="flex flex-col space-y-2">
  <Title />
  <Orders />
  <Tools />
</div>