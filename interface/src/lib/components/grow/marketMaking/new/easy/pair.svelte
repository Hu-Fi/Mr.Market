<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import PairIcon from "$lib/components/common/pairIcon.svelte";
  import {
    findCoinIconBySymbol,
    findExchangeIconByIdentifier,
  } from "$lib/helpers/helpers";

  import {
    createMMEasyPair,
    createMMSelectPairEasyFilter,
    createMMSelectPairEasySearch,
  } from "$lib/stores/grow";
  import { SUPPORTED_EXCHANGES } from "$lib/helpers/constants";

  const exchangeFilter = SUPPORTED_EXCHANGES.map((exchange) => ({
    name: $_(exchange),
    key: exchange,
    icon: findExchangeIconByIdentifier(exchange),
  }));

  const placeholder = [
    {
      base: "BTC",
      target: "USDT",
      exchange: "binance",
      exchangeIcon:
        "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      baseIcon: findCoinIconBySymbol("BTC"),
      targetIcon: findCoinIconBySymbol("USDT"),
    },
    {
      base: "ETH",
      target: "USDT",
      exchange: "binance",
      exchangeIcon:
        "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      baseIcon: findCoinIconBySymbol("ETH"),
      targetIcon: findCoinIconBySymbol("USDT"),
    },
    {
      base: "SOL",
      target: "USDT",
      exchange: "binance",
      exchangeIcon:
        "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      baseIcon: findCoinIconBySymbol("SOL"),
      targetIcon: findCoinIconBySymbol("USDT"),
    },
    {
      base: "ADA",
      target: "USDT",
      exchange: "binance",
      exchangeIcon:
        "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      baseIcon: findCoinIconBySymbol("ADA"),
      targetIcon: findCoinIconBySymbol("USDT"),
    },
    {
      base: "XRP",
      target: "USDT",
      exchange: "binance",
      exchangeIcon:
        "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png",
      baseIcon: findCoinIconBySymbol("XRP"),
      targetIcon: findCoinIconBySymbol("USDT"),
    },
  ];
  let assets = placeholder.map((item) => ({ ...item, selected: false }));
  $: placeholders = $createMMSelectPairEasySearch
    ? assets.filter((item) => {
        // Filter search
        return item.base
          .toUpperCase()
          .match($createMMSelectPairEasySearch.toUpperCase());
      })
    : assets;
</script>

<div class="flex flex-col justify-start items-start space-y-4 mb-20">
  <!-- Search -->
  <div class="join w-full px-2">
    <!-- Search Icon -->
    <div
      class={clsx(
        "join-item flex items-center rounded-full pl-3",
        "bg-base-200/60",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        /></svg
      >
    </div>
    <input
      bind:value={$createMMSelectPairEasySearch}
      class={clsx(
        "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
        "bg-base-200/60",
      )}
      placeholder={$_("search")}
    />
  </div>

  <!-- Filter by exchanges -->
  <div class="px-2 overflow-x-auto w-full no-scrollbar">
    <div class="flex space-x-2 items-center overflow-x-auto no-scrollbar">
      <button
        on:click={() => createMMSelectPairEasyFilter.set("all")}
        class={clsx(
          "flex items-center justify-center rounded-2xl border border-base-100 space-x-1 px-4 py-1.5 no-animation font-medium shadow-none",
          $createMMSelectPairEasyFilter === "all"
            ? "bg-base-200/60"
            : "bg-base-100 border border-base-200",
        )}
      >
        <span class="font-normal text-xs"> {$_("all")} </span>
      </button>
      {#each exchangeFilter as exchange}
        <button
          on:click={() => {
            createMMSelectPairEasyFilter.set(exchange.key);
          }}
          class={clsx(
            "flex items-center justify-center rounded-2xl border border-base-100 no-animation font-medium shadow-none",
            $createMMSelectPairEasyFilter === exchange.key
              ? "bg-base-200/60"
              : "bg-base-100 border border-base-200",
          )}
        >
          <div class="flex items-center justify-center mx-5 space-x-1 py-1.5">
            <img src={exchange.icon} alt="" class="w-4 h-4 rounded-full" />
            <span class="font-normal text-xs"> {exchange.name} </span>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Pairs -->
  <div class="px-2 w-full !mt-6">
    <div class="grid grid-cols-2 gap-4 w-full overflow-y-auto">
      {#each placeholders as item}
        <button
          class={clsx(
            "flex items-center justify-center shadow-none space-x-2 py-3 bg-base-100 border border-base-200 rounded-xl text-start",
            false ? "border-primary" : "",
          )}
          on:click={() => {
            createMMEasyPair.set(item);
            goto("/grow/market_making/new/easy/two");
          }}
        >
          <PairIcon
            clazz="w-5 h-5"
            claxx="w-2 h-2"
            asset0Icon={item.baseIcon}
            asset1Icon={item.targetIcon}
          />
          <div class="flex flex-col">
            <span class="text-sm font-semibold">
              {item.base}/{item.target}
            </span>
            <span class="text-xs !text-[10px] opacity-60 capitalize">
              {item.exchange}
            </span>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
