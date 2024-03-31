<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n";
  import { CoinMarketCategory } from "$lib/stores/market";

  const MARKET_CATEGORIES = [
    { name: $_("All"), key: '' },
    { name: $_("Decentralized finance"), key: 'decentralized_finance_defi' },
    { name: $_("Stablecoins"), key: 'stablecoins' },
  ];
</script>

<div class="w-full overflow-x-auto no-scrollbar flex">
  {#each MARKET_CATEGORIES as item}
    <button
      class="btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4"
      on:click={() => CoinMarketCategory.set(item.key)}
    >
      <span class={clsx("font-medium text-xs text-start", item.key === $CoinMarketCategory ? "font-semibold opacity-100" : "opacity-60")}>{item.name}</span>
    </button>
  {/each}
</div>
