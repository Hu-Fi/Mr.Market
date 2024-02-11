<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { asks, bids, current, usdValue } from "$lib/stores/trade";
  import { orderBookMode, orderType, price } from "$lib/stores/trade";
  import { formatOrderBookAmount, formatOrderBookPrice, formatUSMoney, formatUSNumber } from "$lib/helpers/utils";
  import { LIMIT_ORDERBOOK_LENGTH, LIMIT_ORDERBOOK_HALF_LENGTH, MARKET_ORDERBOOK_LENGTH, MARKET_ORDERBOOK_HALF_LENGTH } from "$lib/helpers/constants";

  $: marketMode = $orderType.index === 1
</script>

<div class={clsx(marketMode? "space-y-1": "space-y-1.5")}>
  <!-- Default mode -->
  {#if $orderBookMode === 0}
    <!-- Ask -->
    <div class="{clsx("flex flex-col", marketMode? "space-y-0.5":"space-y-1.5")}">
      {#each $asks.slice(marketMode ? $asks.length-MARKET_ORDERBOOK_HALF_LENGTH : $asks.length-LIMIT_ORDERBOOK_HALF_LENGTH, $asks.length) as a}
        <button class="flex justify-between" on:click={()=>{price.set(a.price)}}>
          <div class={clsx("text-xs text-start", "text-red-500")}>
            <span> {formatOrderBookPrice(a.price)} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatOrderBookAmount(a.amount)} </span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Current Price -->
    <div class="flex flex-col">
      <button class="text-start" on:click={()=>{price.set($current)}}>
        <span class={clsx("text-lg font-bold", "text-red-500", false && "text-green-500")}>
          {formatUSNumber($current)}
        </span>
      </button>
      <span class="text-xs text-start !text-[10px]">
        ={formatUSMoney($usdValue)}
      </span>
    </div>

    <!-- Bid -->
    <div class="{clsx("flex flex-col", marketMode? "space-y-0.5":"space-y-1.5")}">
      {#each $bids.slice(0, marketMode ? MARKET_ORDERBOOK_HALF_LENGTH : LIMIT_ORDERBOOK_HALF_LENGTH) as b}
        <button class="flex justify-between" on:click={()=>{price.set(b.price)}}>
          <div class={clsx("text-xs text-start", "text-green-500")}>
            <span> {formatOrderBookPrice(b.price)} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatOrderBookAmount(b.amount)} </span>
          </div>
        </button>
      {/each}
    </div>
    
  {:else if $orderBookMode === 1}
    <!-- Show all Ask -->
    <!-- Ask -->
    <div class="{clsx("flex flex-col", marketMode? "space-y-0.5":"space-y-1.5")}">
      {#each $asks.slice(marketMode ? $asks.length-MARKET_ORDERBOOK_LENGTH : $asks.length-LIMIT_ORDERBOOK_LENGTH, $asks.length) as a}
        <button class="flex justify-between" on:click={()=>{price.set(a.price)}}>
          <div class={clsx("text-xs text-start", "text-red-500")}>
            <span> {formatOrderBookPrice(a.price)} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatOrderBookAmount(a.amount)} </span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Current Price -->
    <button class={clsx("flex flex-col", $orderBookMode === 1 && "!mt-1.5")} on:click={()=>{price.set($current)}}>
      <span class={clsx("text-lg font-bold", "text-red-500", false && "text-green-500")}>
        {$current}
      </span>
      <span class="text-xs text-start !text-[10px]">
        =${$usdValue}
      </span>
    </button>


  {:else if $orderBookMode === 2}
    <!-- Show all Bid -->
    <!-- Current Price -->
    <button class="flex flex-col" on:click={()=>{price.set($current)}}>
      <span class={clsx("text-lg font-bold", "text-red-500", false && "text-green-500")}>
        {$current}
      </span>
      <span class="text-xs text-start !text-[10px]">
        =${$usdValue}
      </span>
    </button>

    <!-- Bid -->
    <div class="{clsx("flex flex-col", marketMode? "space-y-0.5":"space-y-1.5", $orderBookMode === 2 && "!mt-1.5")}">
      {#each $bids.slice(0, marketMode ? MARKET_ORDERBOOK_LENGTH : LIMIT_ORDERBOOK_LENGTH) as b}
        <button class="flex justify-between" on:click={()=>{price.set(b.price)}}>
          <div class={clsx("text-xs text-start", "text-green-500")}>
            <span> {formatOrderBookPrice(b.price)} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatOrderBookAmount(b.amount)} </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>