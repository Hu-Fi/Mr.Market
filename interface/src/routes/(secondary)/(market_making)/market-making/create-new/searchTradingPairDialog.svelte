<script lang="ts">
  import { _ } from "svelte-i18n";
  import ExchangeName from "$lib/components/common/exchangeName.svelte";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import emptyToken from "$lib/images/empty-token.svg";

  type TradingPair =
    | string
    | {
        symbol?: string;
        baseSymbol?: string;
        quoteSymbol?: string;
        exchange?: string;
      };

  export let supportedTradingPairs: TradingPair[] = [];
  export let exchangeName: string | null = null;
  export let onSelect: (tradingPair: string) => void = () => {};

  let searchTerm = "";
  let dialogRef: HTMLDialogElement | null = null;

  const buildLabel = (pair: TradingPair): string => {
    if (typeof pair === "string") return pair;
    if (pair.symbol) return pair.symbol;
    if (pair.baseSymbol && pair.quoteSymbol) return `${pair.baseSymbol}/${pair.quoteSymbol}`;
    return "";
  };

  const baseSymbolOf = (pair: TradingPair): string | null => {
    if (typeof pair === "string") {
      const [base] = pair.split("/");
      return base ?? null;
    }
    return pair.baseSymbol ?? null;
  };

  const quoteSymbolOf = (pair: TradingPair): string | null => {
    if (typeof pair === "string") {
      const [, quote] = pair.split("/");
      return quote ?? null;
    }
    return pair.quoteSymbol ?? null;
  };

  const normalize = (value: string | null | undefined) => value?.toLowerCase().trim() ?? "";

  const determineExchangeName = (pair: TradingPair): string | null => {
    if (typeof pair === "string") {
      return null;
    }
    return pair.exchange ?? null;
  };

  const iconFor = (symbol: string | null) => {
    if (!symbol) return emptyToken;
    return findCoinIconBySymbol(symbol.toUpperCase()) || emptyToken;
  };

  $: normalizedPairs = supportedTradingPairs
    .map((pair) => {
      const label = buildLabel(pair);
      if (!label) return null;

      const base = baseSymbolOf(pair);
      const quote = quoteSymbolOf(pair);

      return {
        label,
        value: pair,
        base,
        quote,
        exchange: determineExchangeName(pair),
        baseIcon: iconFor(base),
        quoteIcon: iconFor(quote),
      };
    })
    .filter(Boolean) as Array<{
      label: string;
      value: TradingPair;
      base: string | null;
      quote: string | null;
      exchange: string | null;
      baseIcon: string;
      quoteIcon: string;
    }>;

  $: filteredPairs =
    searchTerm.trim().length === 0
      ? normalizedPairs
      : normalizedPairs.filter(({ label, base, quote }) => {
          const term = normalize(searchTerm);
          return (
            normalize(label).includes(term) ||
            (base && normalize(base).includes(term)) ||
            (quote && normalize(quote).includes(term))
          );
        });

  const handleSelect = (pairLabel: string) => {
    onSelect(pairLabel);
    dialogRef?.close();
  };
</script>

<dialog
  id="mm_search_trading_pair"
  class="modal modal-bottom sm:modal-middle"
  bind:this={dialogRef}
>
  <div class="modal-box p-0 h-[70vh] max-h-[70vh] flex flex-col gap-0">
    <div class="px-5 py-4 border-b border-base-200 flex items-center justify-between">
      <h3 class="text-base font-semibold">{$_("select_trading_pair")}</h3>
      <button class="btn btn-xs btn-ghost" type="button" on:click={() => dialogRef?.close()}>
        ✕
      </button>
    </div>

    <div class="px-5 py-4 border-b border-base-200">
      <label class="input input-sm input-bordered rounded-full flex items-center gap-2 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
        </svg>
        <input
          type="text"
          placeholder={$_("search")}
          bind:value={searchTerm}
          class="grow rounded-full"
        />
      </label>
    </div>

    <div class="px-5 py-3 overflow-y-auto flex-1 space-y-2">
      {#if filteredPairs.length > 0}
        {#each filteredPairs as pair}
          <button
            type="button"
            class={`w-full px-3 py-3 text-left border transition-all border-slate-200 rounded-2xl`}
            on:click={() => handleSelect(pair.label)}
          >
            <div class="flex items-center gap-4">
              <div class="flex -space-x-3">
                <img
                  src={pair.baseIcon}
                  alt={pair.base ?? ""}
                  class="w-8 h-8 rounded-full border border-base-200 bg-base-100 object-contain"
                  loading="lazy"
                />
                <img
                  src={pair.quoteIcon}
                  alt={pair.quote ?? ""}
                  class="w-8 h-8 rounded-full border border-base-200 bg-base-100 object-contain"
                  loading="lazy"
                />
              </div>
              <div class="flex flex-col">
                <p class="font-medium">{pair.label}</p>
                <div class="text-xs text-base-content/60">
                  {#if pair.exchange || exchangeName}
                    <ExchangeName
                      exchangeName={pair.exchange ?? exchangeName ?? ""}
                      clazz="text-xs text-base-content/60"
                    />
                  {:else}
                    <span class="text-xs text-base-content/40">Unknown exchange</span>
                  {/if}
                </div>
              </div>
            </div>
          </button>
        {/each}
      {:else}
        <div class="text-center text-sm text-base-content/70 py-10">
          {$_("no_trading_pairs_found")}
        </div>
      {/if}
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>{$_("close")}</button>
    </form>
  </div>
</dialog>