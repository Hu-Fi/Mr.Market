<script lang="ts">
  import { _ } from "svelte-i18n";
  import { formatDecimals, formatUSMoney } from "$lib/helpers/utils";

  export let baseIcon: string;
  export let baseSymbol: string | null = null;
  export let quoteIcon: string;
  export let quoteSymbol: string | null = null;
  export let basePrice = 1;
  export let quotePrice = 1;
  export let baseBalance = "0";
  export let quoteBalance = "0";
  export let baseAmount = "";
  export let quoteAmount = "";
  export let showBase = true;
  export let showQuote = true;

  const getFiatValue = (amount: string, price: number) => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return formatUSMoney(0);
    const fiatValue = formatDecimals(numericAmount * price, 3);
    return formatUSMoney(fiatValue);
  };
</script>

<div class="flex flex-col space-y-6">
  {#if showBase}
    <div class="flex flex-col w-full">
      <div
        class="flex items-center w-full border border-base-300 rounded-[2rem] px-4 py-4 bg-base-100"
      >
        <img
          src={baseIcon}
          alt={baseSymbol}
          class="w-10 h-10 mr-4 rounded-full"
        />
        <input
          type="text"
          inputmode="decimal"
          required
          bind:value={baseAmount}
          placeholder={$_("enter_symbol_amount", {
            values: { symbol: baseSymbol ?? "" },
          })}
          class="input input-ghost w-full focus:outline-none focus:bg-transparent text-lg p-0 h-auto font-medium placeholder:text-base-content/30 placeholder:font-bold"
        />
      </div>
      <div class="flex justify-between px-4 mt-2">
        <span class="text-xs font-bold text-base-content/50">
          {getFiatValue(baseAmount, basePrice)}
        </span>
        <button
          class="text-xs font-bold text-base-content/50 hover:text-base-content transition-colors"
          on:click={() => {}}
        >
          {$_("balance_of", { values: { amount: baseBalance || 0 } })}
        </button>
      </div>
    </div>
  {/if}

  {#if showQuote}
    <div class="flex flex-col w-full">
      <div
        class="flex items-center w-full border border-base-300 rounded-[2rem] px-4 py-4 bg-base-100"
      >
        <img
          src={quoteIcon}
          alt={quoteSymbol}
          class="w-10 h-10 mr-4 rounded-full"
        />
        <input
          type="text"
          inputmode="decimal"
          required
          bind:value={quoteAmount}
          placeholder={$_("enter_symbol_amount", {
            values: { symbol: quoteSymbol ?? "" },
          })}
          class="input input-ghost w-full focus:outline-none focus:bg-transparent text-lg p-0 h-auto font-medium placeholder:text-base-content/30 placeholder:font-bold"
        />
      </div>
      <div class="flex justify-between px-4 mt-2">
        <span class="text-xs font-bold text-base-content/50">
          {getFiatValue(quoteAmount, quotePrice)}
        </span>
        <button
          class="text-xs font-bold text-base-content/50 hover:text-base-content transition-colors"
          on:click={() => {}}
        >
          {$_("balance_of", { values: { amount: quoteBalance || 0 } })}
        </button>
      </div>
    </div>
  {/if}
</div>
