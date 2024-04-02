<script lang="ts">
  import clsx from "clsx";
  import { asks, bids, current, usdValue, orderBookMode, orderType, price, buy, orderBookLoaded } from "$lib/stores/spot";
  import { formatFixedOrderBookAmount, formatFixedOrderBookPrice, formatUSMoney, formatUSNumber } from "$lib/helpers/utils";
  import { LIMIT_ORDERBOOK_LENGTH, LIMIT_ORDERBOOK_HALF_LENGTH, MARKET_ORDERBOOK_LENGTH, MARKET_ORDERBOOK_HALF_LENGTH } from "$lib/helpers/constants";

  $: marketMode = $orderType.index === 1
</script>

{#if $orderBookLoaded}
  <div class={clsx(marketMode? "space-y-1": "space-y-1.5")}>
    <!-- Default mode -->
    {#if $orderBookMode === 0}
      <!-- Ask -->
      <div class="{clsx("flex flex-col", marketMode? "space-y-0.5":"space-y-1.5")}">
        {#each $asks.slice(marketMode ? $asks.length-MARKET_ORDERBOOK_HALF_LENGTH : $asks.length-LIMIT_ORDERBOOK_HALF_LENGTH, $asks.length) as a}
          <button class="flex justify-between" on:click={()=>{price.set(a.price)}}>
            <div class={clsx("text-xs min-w-12 text-right", "text-red-500")}>
              <span> {formatFixedOrderBookPrice(a.price)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(a.amount)} </span>
            </div>
          </button>
        {/each}
      </div>

      <!-- Current Price -->
      <div class="flex flex-col">
        <button class="text-start" on:click={()=>{price.set($current)}}>
          <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
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
           <div class={clsx("text-xs min-w-12 text-right", "text-green-500")}>
              <span> {formatFixedOrderBookPrice(b.price)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(b.amount)} </span>
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
            <div class={clsx("text-xs min-w-12 text-right", "text-red-500")}>
              <span> {formatFixedOrderBookPrice(a.price)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(a.amount)} </span>
            </div>
          </button>
        {/each}
      </div>

      <!-- Current Price -->
      <button class={clsx("flex flex-col", $orderBookMode === 1 && "!mt-1.5")} on:click={()=>{price.set($current)}}>
        <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
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
        <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
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
            <div class={clsx("text-xs min-w-12 text-right", "text-green-500")}>
              <span> {formatFixedOrderBookPrice(b.price)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(b.amount)} </span>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div class={clsx(marketMode ? "h-56" : "h-[19rem]", "flex items-center justify-center")}>
    <span class="loading" />
  </div>
{/if}