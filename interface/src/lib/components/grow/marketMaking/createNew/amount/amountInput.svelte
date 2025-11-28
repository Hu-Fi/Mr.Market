<script lang="ts">
  import { _ } from "svelte-i18n";
  import { formatUSMoney } from "$lib/helpers/utils";

  export let baseIcon: string;
  export let baseSymbol: string | null = null;
  export let quoteIcon: string;
  export let quoteSymbol: string | null = null;
  export let basePrice = 1000;
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
    return formatUSMoney(numericAmount * price);
  };
</script>

<div class="flex flex-col space-y-0">
  {#if showBase}
    <div class="flex flex-col p-4 pb-2 fieldset">
      <label
        class="input input-xl rounded-xl flex items-center w-full justify-between"
      >
        <img
          src={baseIcon}
          alt={baseSymbol}
          class="w-8 h-8 mr-2 inline-block align-middle"
        />
        <input
          type="text"
          inputmode="decimal"
          required
          bind:value={baseAmount}
          placeholder={$_("enter_symbol_amount", {
            values: { symbol: baseSymbol ?? "" },
          })}
          class="focus:outline-none text-xl!"
        />
      </label>
      <div class="flex justify-between">
        <p class="label px-2">{getFiatValue(baseAmount, basePrice)}</p>
        <button class="label px-2" on:click={() => {}}>
          {$_("balance_of", { values: { amount: baseBalance || 0 } })}
        </button>
      </div>
    </div>
  {/if}

  {#if showQuote}
    <div class="flex flex-col p-4 fieldset">
      <label
        class="input input-xl rounded-xl flex items-center w-full justify-between"
      >
        <img
          src={quoteIcon}
          alt={quoteSymbol}
          class="w-8 h-8 mr-2 inline-block align-middle"
        />
        <input
          type="text"
          inputmode="decimal"
          required
          bind:value={quoteAmount}
          placeholder={$_("enter_symbol_amount", {
            values: { symbol: quoteSymbol ?? "" },
          })}
          class="focus:outline-none text-xl!"
        />
      </label>
      <div class="flex justify-between">
        <p class="label px-2">{getFiatValue(quoteAmount, quotePrice)}</p>
        <button class="label px-2" on:click={() => {}}>
          {$_("balance_of", { values: { amount: quoteBalance || 0 } })}
        </button>
      </div>
    </div>
  {/if}
</div>
