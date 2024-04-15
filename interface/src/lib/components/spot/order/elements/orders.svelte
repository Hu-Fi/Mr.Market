<script lang="ts">
  import clsx from "clsx";
  import { asks, bids, pair, current, usdValue, orderBookMode, orderTypeMarket, buy, orderBookLoaded, limitPrice } from "$lib/stores/spot";
  import { formatFixedOrderBookAmount, formatFixedOrderBookPrice, formatUSMoney, formatUSNumber } from "$lib/helpers/utils";
  import { LIMIT_ORDERBOOK_LENGTH, LIMIT_ORDERBOOK_HALF_LENGTH, MARKET_ORDERBOOK_LENGTH, MARKET_ORDERBOOK_HALF_LENGTH } from "$lib/helpers/constants";

  const estimateNumberOfDecimals = () =>  Math.max(1, (`${formatUSNumber($current)}`.split('.')[1] || '').length)
  let estimatedPricePrecision = estimateNumberOfDecimals()
  pair.subscribe(() => estimatedPricePrecision = estimateNumberOfDecimals())
  current.subscribe(() => estimatedPricePrecision = Math.max(estimateNumberOfDecimals(), estimatedPricePrecision))
</script>

{#if $orderBookLoaded}
  <div class={clsx($orderTypeMarket ? "space-y-1": "space-y-1.5")}>
    <!-- Default mode -->
    {#if $orderBookMode === 0}
      <!-- Ask -->
      <div class="{clsx("flex flex-col", $orderTypeMarket ? "space-y-0.5":"space-y-1.5")}">
        {#each $asks.slice($orderTypeMarket ? $asks.length-MARKET_ORDERBOOK_HALF_LENGTH : $asks.length-LIMIT_ORDERBOOK_HALF_LENGTH, $asks.length) as a}
          <button class="flex justify-between" on:click={()=>{limitPrice.set(a.price)}}>
            <div class={clsx("text-xs text-start", "text-red-500")}>
              <span> {formatFixedOrderBookPrice(a.price, estimatedPricePrecision)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(a.amount)} </span>
            </div>
          </button>
        {/each}
      </div>

      <!-- Current Price -->
      <div class="flex flex-col">
        <button class="text-start" on:click={()=>{limitPrice.set($current)}}>
          <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
            {formatUSNumber($current)}
          </span>
        </button>
        <span class="text-xs text-start !text-[10px]">
          ={formatUSMoney($usdValue)}
        </span>
      </div>

      <!-- Bid -->
      <div class="{clsx("flex flex-col", $orderTypeMarket ? "space-y-0.5":"space-y-1.5")}">
        {#each $bids.slice(0, $orderTypeMarket ? MARKET_ORDERBOOK_HALF_LENGTH : LIMIT_ORDERBOOK_HALF_LENGTH) as b}
          <button class="flex justify-between" on:click={()=>{limitPrice.set(b.price)}}>
            <div class={clsx("text-xs text-start", "text-green-500")}>
              <span> {formatFixedOrderBookPrice(b.price, estimatedPricePrecision)} </span>
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
      <div class="{clsx("flex flex-col", $orderTypeMarket ? "space-y-0.5":"space-y-1.5")}">
        {#each $asks.slice($orderTypeMarket ? $asks.length-MARKET_ORDERBOOK_LENGTH : $asks.length-LIMIT_ORDERBOOK_LENGTH, $asks.length) as a}
          <button class="flex justify-between" on:click={()=>{limitPrice.set(a.price)}}>
            <div class={clsx("text-xs text-start", "text-red-500")}>
              <span> {formatFixedOrderBookPrice(a.price, estimatedPricePrecision)} </span>
            </div>

            <div class="text-xs text-end">
              <span> {formatFixedOrderBookAmount(a.amount)} </span>
            </div>
          </button>
        {/each}
      </div>

      <!-- Current Price -->
      <button class={clsx("flex flex-col", $orderBookMode === 1 && "!mt-1.5")} on:click={()=>{limitPrice.set($current)}}>
        <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
          {formatUSNumber($current)}
        </span>
        <span class="text-xs text-start !text-[10px]">
          ={formatUSMoney($usdValue)}
        </span>
      </button>


    {:else if $orderBookMode === 2}
      <!-- Show all Bid -->
      <!-- Current Price -->
      <button class="flex flex-col" on:click={()=>{limitPrice.set($current)}}>
        <span class={clsx("text-lg font-bold", $buy ? "text-green-500" : "text-red-500")}>
          {formatUSNumber($current)}
        </span>
        <span class="text-xs text-start !text-[10px]">
          ={formatUSMoney($usdValue)}
        </span>
      </button>

      <!-- Bid -->
      <div class="{clsx("flex flex-col", $orderTypeMarket ? "space-y-0.5":"space-y-1.5", $orderBookMode === 2 && "!mt-1.5")}">
        {#each $bids.slice(0, $orderTypeMarket ? MARKET_ORDERBOOK_LENGTH : LIMIT_ORDERBOOK_LENGTH) as b}
          <button class="flex justify-between" on:click={()=>{limitPrice.set(b.price)}}>
            <div class={clsx("text-xs text-start", "text-green-500")}>
              <span> {formatFixedOrderBookPrice(b.price, estimatedPricePrecision)} </span>
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
  <div class={clsx($orderTypeMarket ? "h-[14.25rem]" : "h-[19rem]", "flex items-center justify-center")}>
    <span class="loading" />
  </div>
{/if}