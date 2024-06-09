<script lang="ts">
  import clsx from "clsx";
  import { goto } from "$app/navigation";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { createArbExchange1, createArbExchange2 } from "$lib/stores/grow";

  export let typeIndex: 1 | 2 = 1;
  export let exchangeName = '';
  export let i = 0;
</script>

{#if typeIndex === 1}
  <button
    class={clsx(
      "flex flex-row px-4 items-center space-x-4 justify-start shadow-none py-3 bg-base-100 border border-base-200 rounded-xl text-start",
    )}
    on:click={() => {
      createArbExchange1.set(exchangeName)
      goto('/grow/arbitrage/new/two')
    }}
    data-testid={`arbitrage-first-exchange-${i}`}
    >
    <img src={findExchangeIconByIdentifier(exchangeName)} class="w-8 h-8 rounded-full" alt="" />
    <div class="flex flex-col grow">
      <span class="text-base font-semibold capitalize">
        {exchangeName}
      </span>
    </div>
  </button>

{:else if typeIndex === 2}
  <button
    class={clsx(
      "flex flex-row px-4 items-center space-x-4 justify-start shadow-none py-3 bg-base-100 border border-base-200 rounded-xl text-start",
    )}
    disabled={exchangeName === $createArbExchange1}
    on:click={() => {
      createArbExchange2.set(exchangeName);
      goto('/grow/arbitrage/new/three')
    }}
    data-testid={`arbitrage-second-exchange-${i}`}
    >
    <img src={findExchangeIconByIdentifier(exchangeName)} class="w-8 h-8 rounded-full" alt="" />
    <div class="flex flex-col grow">
      <span class="text-base font-semibold capitalize">
        {exchangeName}
      </span>
    </div>
  </button>
{/if}