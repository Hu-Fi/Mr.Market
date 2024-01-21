<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { formatDecimals, formatUSMoney, formatUSNumber, roundToDigits } from "$lib/helpers/utils";
  import { orderBookDecimal as obd, orderBookMode, orderType, price } from "$lib/stores/trade";

  import { asks, bids, current, usdValue } from "$lib/stores/trade";

  $: decimalPlace = $obd === 0.1 ? 1 : $obd === 1 ? 0 : $obd === 10 ? -1 : $obd === 100 ? -2 : 2;
  $: magic = (x: number) => roundToDigits(x, decimalPlace);
</script>

<div class={clsx($orderType.index === 1? "space-y-1": "space-y-1.5")}>
  <!-- Default mode -->
  {#if $orderBookMode === 0}
    <!-- Ask -->
    <div class="{clsx("flex flex-col", $orderType.index === 1? "space-y-0.5":"space-y-1.5")}">
      {#each $asks.slice(0, $orderType.index === 1? 5: 6) as a}
        <button class="flex justify-between" on:click={()=>{price.set(magic(a.price))}}>
          <div class={clsx("text-xs text-start", "text-red-500")}>
            <span> {formatUSNumber(magic(a.price))} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatDecimals(a.amount,2)} </span>
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
    <div class="{clsx("flex flex-col", $orderType.index === 1? "space-y-0.5":"space-y-1.5")}">
      {#each $bids.slice(0, $orderType.index === 1? 5: 6) as b}
        <button class="flex justify-between" on:click={()=>{price.set(magic(b.price))}}>
          <div class={clsx("text-xs text-start", "text-green-500")}>
            <span> {formatUSNumber(magic(b.price))} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatDecimals(b.amount,2)} </span>
          </div>
        </button>
      {/each}
    </div>
    
  {:else if $orderBookMode === 1}
    <!-- Show all Ask -->
    <!-- Ask -->
    <div class="{clsx("flex flex-col", $orderType.index === 1? "space-y-0.5":"space-y-1.5")}">
      {#each $asks.slice(0, $orderType.index === 1? 10: 12) as a}
        <button class="flex justify-between" on:click={()=>{price.set(magic(a.price))}}>
          <div class={clsx("text-xs text-start", "text-red-500")}>
            <span> {formatUSNumber(magic(a.price))} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatDecimals(a.amount,2)} </span>
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
    <div class="{clsx("flex flex-col", $orderType.index === 1? "space-y-0.5":"space-y-1.5", $orderBookMode === 2 && "!mt-1.5")}">
      {#each $bids.slice(0, $orderType.index === 1? 10: 12) as b}
        <button class="flex justify-between" on:click={()=>{price.set(magic(b.price))}}>
          <div class={clsx("text-xs text-start", "text-green-500")}>
            <span> {formatUSNumber(magic(b.price))} </span>
          </div>

          <div class="text-xs text-end">
            <span> {formatDecimals(b.amount,2)} </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
</style>
