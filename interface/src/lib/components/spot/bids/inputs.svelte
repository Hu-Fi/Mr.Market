<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  //@ts-expect-error types
  import { cleave } from "svelte-cleavejs";
  import { darkTheme } from "$lib/stores/theme";
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { BN, formatDecimals } from "$lib/helpers/utils";
  import { mixinConnectLoading, mixinConnected } from "$lib/stores/home";
  import { BOT_ID, OAUTH_SCOPE, maskOption } from "$lib/helpers/constants";
  import {
    pair,
    buy,
    current,
    orderTypeLimit,
    orderTypeMarket,
    limitPrice,
    limitTotal,
    limitAmount,
    marketAmount,
    marketTotal,
    marketPrice,
  } from "$lib/stores/spot";

  let usdValue = 1;
  let slider = 0;
  let tooltipOpen = false;
  let baseBalance = 6543.223;
  let targetBalance = 12.231;

  // Auto hide slider after finger left
  const handleInput = () => {
    tooltipOpen = true;
  };
  const handleChange = () => {
    tooltipOpen = false;
  };
  // Auto calculate Amount after total input
  const getAmount = () => {
    if ($orderTypeLimit) {
      limitAmount.set(
        formatDecimals(BN($limitTotal).dividedBy($limitPrice).toNumber(), 8) ||
          "",
      );
      return;
    }
    if ($orderTypeMarket) {
      console.log('getAmount()=>Market')
      marketAmount.set(
        formatDecimals(
          BN($marketTotal).dividedBy($marketPrice).toNumber(),
          8,
        ) || "",
      );
      return;
    }
  };
  const getTotal = () => {
    if ($orderTypeLimit && $buy) {
      limitTotal.set(
        formatDecimals(
          BN($limitAmount).multipliedBy($limitPrice).toNumber(),
          8,
        ) || "",
      );
      return;
    }
    if ($orderTypeLimit && !$buy) {
      limitTotal.set(
        formatDecimals(BN($limitAmount).multipliedBy($current).toNumber(), 8) ||
          "",
      );
      return;
    }
    if ($orderTypeMarket && $buy) {
      marketTotal.set(
        formatDecimals(
          BN($marketAmount).dividedBy($current).toNumber(),
          8,
        ) || "",
      );
      return;
    }
    if ($orderTypeMarket && !$buy) {
      marketTotal.set(
        formatDecimals(BN($marketAmount).multipliedBy($current).toNumber(), 8) ||
          "",
      );
      return;
    }
  };
  const setBalance = () => {
    if ($orderTypeLimit) {
      if ($buy) {
        limitTotal.set(baseBalance);
      } else {
        limitTotal.set(targetBalance);
      }
      return;
    }
    if ($orderTypeMarket) {
      if ($buy) {
        marketAmount.set(baseBalance);
      } else {
        marketAmount.set(targetBalance);
      }
      return;
    }
    getAmount();
  };
  const setSlider = () => {
    if ($orderTypeLimit && $buy) {
      limitTotal.set(
        formatDecimals(
          BN(baseBalance).multipliedBy(slider).dividedBy(100).toNumber(),
          8,
        ) || "",
      );
      getAmount();
      return;
    }
    if ($orderTypeLimit && !$buy) {
      limitAmount.set(
        formatDecimals(
          BN(targetBalance).multipliedBy(slider).dividedBy(100).toNumber(),
          8,
        ) || "",
      );
      getTotal();
      return;
    }
    if ($orderTypeMarket && $buy) {
      marketAmount.set(
        formatDecimals(
          BN(baseBalance).multipliedBy(slider).dividedBy(100).toNumber(),
          8,
        ) || "",
      );
      getTotal();
    }
    if ($orderTypeMarket && !$buy) {
      marketAmount.set(
        formatDecimals(
          BN(targetBalance).multipliedBy(slider).dividedBy(100).toNumber(),
          8,
        ) || "",
      );
      getTotal();
    }
  };

  const auth = async () => {
    mixinConnectLoading.set(true);
    authorize(
      { clientId: BOT_ID, scope: OAUTH_SCOPE, pkce: true },
      {
        onShowUrl: (url: string) => {
          window.open(url);
        },
        onError: (error: Error) => {
          console.error(error);
          mixinConnectLoading.set(false);
          return;
        },
        onSuccess: async (token: string) => {
          await AfterMixinOauth(token);
          mixinConnectLoading.set(false);
        },
      },
    );
  };

  // Set total as slider change
  $: slider, setSlider();
  // Update total amount as limit price change
  $: if ($orderTypeLimit) {$limitPrice; getTotal();}
  $: if ($orderTypeMarket) {$current; getTotal();}
  // Show 0 when estimated price is NaN
  $: est = $limitPrice ? BN($limitPrice).multipliedBy(usdValue) : 0;
  // Clear values when buy/sell change
  $: $buy, limitAmount.set(""), limitTotal.set(""), marketAmount.set(""), marketTotal.set(""), slider = 0;
</script>

<div>
  <!-- Price input -->
  <div
    class={clsx(
      "flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400",
      $orderTypeMarket
        ? $darkTheme
          ? "bg-slate-800"
          : "bg-slate-50"
        : "bg-base-100",
    )}
  >
    {#if $orderTypeLimit}
      <input
        type="tel"
        use:cleave={maskOption}
        bind:value={$limitPrice}
        placeholder={$_("price")}
        class={clsx(
          "input input-sm text-base bg-base-100 w-full focus:outline-none focus:border-0 px-0",
        )}
      />
      <span class="text-xs opacity-60"> {$pair.symbol.split("/")[1]} </span>
    {:else if $orderTypeMarket}
      <input
        disabled
        placeholder={$_("market_price")}
        class={clsx(
          "h-[2rem] text-base w-full px-0",
          $darkTheme ? "bg-slate-800" : "bg-slate-50",
        )}
      />
    {/if}
  </div>

  {#if $orderTypeLimit}
    <!-- Est value -->
    <div class="w-full truncate opacity-60">
      <span class="text-xs"> {$_("value")} {"$" + est} </span>
    </div>
  {/if}

  {#if $orderTypeLimit}
    <!-- Amount input -->
    <div
      class="flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400"
    >
      <input
        type="tel"
        on:keyup={getTotal}
        use:cleave={maskOption}
        bind:value={$limitAmount}
        placeholder={$_("amount")}
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
      <span class="text-xs opacity-60"> {$pair.symbol.split("/")[0]} </span>
    </div>
  {/if}

  <!-- Percentage slider -->
  <div
    class={clsx(
      "opacity-100 flex flex-col my-2",
      tooltipOpen && "tooltip tooltip-top tooltip-open",
    )}
    data-tip={slider + "%"}
  >
    <input
      type="range"
      min="0"
      max="100"
      bind:value={slider}
      on:input={handleInput}
      on:change={handleChange}
      disabled={!$mixinConnected}
      class={clsx($buy ? "range-green" : "range-red", "range range-xs")}
    />
    <div class="w-full flex justify-between text-xs text-[8.75px] opacity-40">
      <span>0%</span>
      <span>25%</span>
      <span>50%</span>
      <span>75%</span>
      <span>100%</span>
    </div>
  </div>

  <!-- Total -->
  <div
    class="flex justify-between items-center border px-2 py-1 my-1 rounded-lg border-base-300 focus-within:border-blue-400"
  >
    {#if $orderTypeLimit}
      <input
        type="tel"
        on:keyup={getAmount}
        use:cleave={maskOption}
        bind:value={$limitTotal}
        placeholder={$_("total")}
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
    {:else if $orderTypeMarket}
      <input
        type="tel"
        on:keyup={getTotal}
        use:cleave={maskOption}
        bind:value={$marketAmount}
        placeholder={$_("total")}
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
    {/if}
    <span class="text-xs opacity-60">
      {
        $orderTypeLimit ?
          $pair.symbol.split("/")[1] :
          $orderTypeMarket ?
          $buy ? $pair.symbol.split("/")[1] : $pair.symbol.split("/")[0] : ''
      }
    </span>
  </div>

  <!-- Balance -->
  <div class="flex items-center justify-between mb-1 py-1">
    {#if $mixinConnected}
      <span class="text-xs opacity-60">{$_("balance")}:</span>
      <button
        class=""
        on:click={() => {
          setBalance();
        }}
        ><span class="text-xs opacity-90"
          >{$buy ? baseBalance : targetBalance}
          {$buy ? $pair.symbol.split("/")[1] : $pair.symbol.split("/")[0]}</span
        ></button
      >
    {:else}
      <button
        class="flex w-full items-center space-x-1"
        on:click={() => auth()}
      >
        <button
          ><span class="text-xs opacity-90">{$_("connect_wallet")}</span
          ></button
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3 h-3 mt-0.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
  .range-green::-moz-range-thumb {
    color: theme("colors.green.400");
    border-color: theme("colors.base-100");
    box-shadow:
      0 0 0 1.5px grey inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0
        var(--filler-size);
  }
  .range-red::-moz-range-thumb {
    color: theme("colors.red.400");
    border-color: theme("colors.base-100");
    box-shadow:
      0 0 0 1.5px grey inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0
        var(--filler-size);
  }
  input[type="range"] {
    -webkit-appearance: none;
  }
  .range-green::-webkit-slider-thumb {
    color: theme("colors.green.400");
    border-color: theme("colors.base-100");
    box-shadow:
      0 0 0 1.5px grey inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0
        var(--filler-size);
  }
  .range-red::-webkit-slider-thumb {
    color: theme("colors.red.400");
    border-color: theme("colors.base-100");
    box-shadow:
      0 0 0 1.5px grey inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0
        var(--filler-size);
  }

  .tooltip::before {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }
</style>