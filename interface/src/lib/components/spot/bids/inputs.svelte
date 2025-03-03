<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  //@ts-expect-error types
  import { cleave } from "svelte-cleavejs";
  import { darkTheme } from "$lib/stores/theme";
  import { userAssets } from "$lib/stores/wallet";
  import authorize from "$lib/helpers/mixin-oauth";
  import { AfterMixinOauth } from "$lib/helpers/mixin";
  import { BN, formatDecimals, formatWalletBalance } from "$lib/helpers/utils";
  import { mixinConnectLoading, mixinConnected } from "$lib/stores/home";
  import { BOT_ID, OAUTH_SCOPE, maskOption } from "$lib/helpers/constants";

  import {
    buy,
    orderTypeLimit,
    orderTypeMarket,
    limitPrice,
    limitTotal,
    limitAmount,
    marketAmount,
    pairBaseSymbol,
    pairTargetSymbol,
  } from "$lib/stores/spot";
  let usdValue = 1;
  let slider = 0;
  let tooltipOpen = false;

  const extractBalance = (symbol: string) => {
    const extractedData = $userAssets.balances.find((balance: { details: { symbol: string } }) => balance.details.symbol === symbol);
    if (!extractedData) {
      return 0;
    }
    return formatWalletBalance(extractedData.balance);
  };
  $: baseBalance = $mixinConnected && $userAssets ? extractBalance($pairTargetSymbol) : 0;
  $: targetBalance = $mixinConnected && $userAssets ? extractBalance($pairBaseSymbol) : 0;

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
      if (!$limitPrice || !$limitTotal) {
        limitAmount.set('');
        return;
      }
      limitAmount.set(
        BN($limitTotal).dividedBy($limitPrice).toFixed() ||
          "",
      );
      return;
    }
  };
  const getTotal = () => {
    if ($orderTypeLimit) {
      if (!$limitPrice || !$limitAmount) {
        limitTotal.set('');
        return;
      }
      
      limitTotal.set(
        BN($limitAmount).multipliedBy($limitPrice).toString() || ''
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
    const balance = $buy ? baseBalance : targetBalance;
    const sliderValue = formatDecimals(
      BN(balance).multipliedBy(slider).dividedBy(100).toNumber(),
      8
    ) || "";
    
    if ($orderTypeLimit) {
      if ($buy) {
        limitTotal.set(sliderValue);
        getAmount();
      } else {
        limitAmount.set(sliderValue);
        getTotal();
      }
      return;
    }
    
    if ($orderTypeMarket) {
      marketAmount.set(sliderValue);
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
  // Show 0 when estimated price is NaN
  $: est = $limitPrice ? BN($limitPrice).multipliedBy(usdValue) : 0;
  // Clear states when buy/sell change
  $: $buy, limitAmount.set(""), limitTotal.set(""), marketAmount.set(""), slider = 0;
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
        type="text"
        inputmode="decimal"
        use:cleave={maskOption}
        bind:value={$limitPrice}
        placeholder={$_("price")}
        data-testid="limit_price_input"
        class={clsx(
          "input input-sm text-base bg-base-100 w-full focus:outline-none focus:border-0 px-0",
        )}
      />
      <span class="text-xs opacity-60"> {$pairTargetSymbol} </span>
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
        type="text"
        inputmode="decimal"
        on:keyup={getTotal}
        use:cleave={maskOption}
        bind:value={$limitAmount}
        placeholder={$_("amount")}
        data-testid="amount_input"
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
      <span class="text-xs opacity-60"> {$pairBaseSymbol} </span>
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
      step="5"
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
        type="text"
        inputmode="decimal"
        on:keyup={getAmount}
        use:cleave={maskOption}
        bind:value={$limitTotal}
        placeholder={$_("total")}
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
    {:else if $orderTypeMarket}
      <input
        type="text"
        inputmode="decimal"
        on:keyup={getTotal}
        use:cleave={maskOption}
        bind:value={$marketAmount}
        placeholder={$_("total")}
        data-testid="total_input"
        class="input input-sm text-base w-full focus:outline-none focus:border-0 px-0"
      />
    {/if}
    <span class="text-xs opacity-60">
      {
        $orderTypeLimit ?
          $pairTargetSymbol :
          $orderTypeMarket ?
          $buy ? $pairTargetSymbol : $pairBaseSymbol : ''
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
          {$buy ? $pairTargetSymbol : $pairBaseSymbol}</span
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