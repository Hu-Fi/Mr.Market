<script lang="ts">
    import { formatUSMoney } from "$lib/helpers/utils";
  import { _ } from "svelte-i18n";

  export let baseIcon: string;
  export let baseSymbol: string;
  export let quoteIcon: string;
  export let quoteSymbol: string;

  $: baseAmount = 0;
  $: quoteAmount = 0;
  const basePrice = 1000;
  const quotePrice = 1;

  const setAmount = () => {};
</script>

<div class="flex flex-col space-y-2">
  <div class="flex flex-col p-4 fieldset">
    <label
      class="input input-xl rounded-xl flex items-center w-full justify-between"
    >
      <img
        src={baseIcon}
        alt={baseSymbol}
        class="w-10 h-10 mr-2 inline-block align-middle"
      />
      <input
        type="search"
        required
        bind:value={baseAmount}
        placeholder={$_("enter_symbol_amount", {
          values: { symbol: baseSymbol },
        })}
        class="focus:outline-none"
      />
    </label>
    <p class="label px-2">{formatUSMoney(baseAmount*basePrice)}</p>
  </div>

  <div class="flex flex-col p-4 fieldset">
    <label
      class="input input-xl rounded-xl flex items-center w-full justify-between"
    >
      <img
        src={quoteIcon}
        alt={quoteSymbol}
        class="w-10 h-10 mr-2 inline-block align-middle"
      />
      <input
        type="search"
        required
        bind:value={quoteAmount}
        placeholder={$_("enter_symbol_amount", {
          values: { symbol: quoteSymbol },
        })}
        class="focus:outline-none"
      />
    </label>
    <p class="label px-2">{formatUSMoney(quoteAmount*quotePrice)}</p>
  </div>
</div>
