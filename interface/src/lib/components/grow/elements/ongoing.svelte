<script lang="ts">
  import { _ } from "svelte-i18n";
  import ArbCard from "../arbitrage/card.svelte";
  import MMCard from "../marketMaking/card.svelte";
  import AICard from "../autoInvest/card.svelte";
  import Create from "./create.svelte";
  import AddMore from "./addMore.svelte";

  const placeholder = [
    {
      type: "arb",
      name: $_("arbitrage"),
      baseExchange: "binance",
      targetExchange: "OKX",
      base: "BTC",
      target: "USDT",
      profit: "-4.52",
      amount: "23124",
      started: "2023-12-28T12:00:12Z",
      id: "df7b605f-ce06-4c3a-abb6-2fe947016fab",
    },
    {
      type: "arb",
      name: $_("arbitrage"),
      baseExchange: "gate",
      targetExchange: "lbank",
      base: "BTC",
      target: "USDT",
      profit: "244.4523",
      amount: "4124",
      started: "2023-12-28T12:00:12Z",
      id: "df7b605f-ce06-4c3a-abb6-2fe947016fab",
    },
    {
      type: "mm",
      name: $_("market_making"),
      exchange: "binance",
      base: "ETH",
      target: "USDT",
      profit: "-1.08",
      amount: "17232",
      started: "2023-09-28T12:00:12Z",
      id: "1c7aeede-e14e-4017-bb38-8ffe57667b93",
    },
    {
      type: "mm",
      name: $_("market_making"),
      exchange: "gate",
      base: "HMT",
      target: "USDT",
      profit: "1.08",
      amount: "17232",
      started: "2023-09-28T12:00:12Z",
      id: "1c7aeede-e14e-4017-bb38-8ffe57667b93",
    },
  ];
</script>

{#if placeholder.length === 0}
  <Create />
{:else}
  <div class="flex flex-col space-y-4 mx-4 mt-6 mb-24">
    {#each placeholder as item}
      {#if item.type === "arb"}
        <ArbCard data={item} />
      {:else if item.type === "mm"}
        <MMCard data={item} />
      {:else if item.type === "auto"}
        <AICard data={item} />
      {/if}
    {/each}
    <AddMore />
  </div>
{/if}
