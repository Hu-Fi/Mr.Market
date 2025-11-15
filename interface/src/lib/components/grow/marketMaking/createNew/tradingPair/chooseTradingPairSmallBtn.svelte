<script>
  import { _ } from "svelte-i18n";
  import emptyToken from "$lib/images/empty-token.svg";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import PairIcon from "$lib/components/common/tradingPairIcon.svelte";

  export let tradingPair = "BTC/USDT";
  export let exchangeName = "";
  export let onClick = () => {};
  $: item = {
    symbol: tradingPair,
    base_symbol: tradingPair.split("/")[0],
    target_symbol: tradingPair.split("/")[1],
    exchange_id: "binance",
  };
</script>

<button
  class="flex items-center justify-center space-x-2 py-3 
    bg-base-100 border border-slate-100 rounded-xl text-start
    border border-slate-100 shadow-sm"
  on:click={() => {
    onClick();
  }}
  data-testid={`market-making-pair-${tradingPair}`}
>
  <PairIcon
    clazz="w-5 h-5"
    claxx="w-2 h-2"
    asset0Icon={findCoinIconBySymbol(item.base_symbol) || emptyToken}
    asset1Icon={findCoinIconBySymbol(item.target_symbol) || emptyToken}
  />
  <div class="flex flex-col">
    <span class="text-sm font-semibold">
      {item.symbol}
    </span>
    <span class="text-xs !text-[10px] opacity-60 capitalize">
      {exchangeName}
    </span>
  </div>
</button>
