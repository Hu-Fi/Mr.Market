<script lang="ts">
    import { _ } from "svelte-i18n";
    import emptyToken from "$lib/images/empty-token.svg";
    import { findCoinIconBySymbol } from "$lib/helpers/helpers";
    import PairIcon from "$lib/components/common/tradingPairIcon.svelte";
    import type { MarketMakingPair } from "$lib/types/hufi/grow";

    export let pair: MarketMakingPair | null = null;
    export let exchangeName = "";
    export let selected = false;
    export let onClick = () => {};

    $: symbol = pair?.symbol || "";
    $: baseSymbol = pair?.base_symbol || symbol.split("/")[0] || "";
    $: quoteSymbol = pair?.quote_symbol || symbol.split("/")[1] || "";
    $: basePrice = pair?.base_price ? parseFloat(pair.base_price) : 0;

    // Format price
    $: displayPrice =
        basePrice > 0
            ? "$" +
              basePrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
              })
            : "$0.00";
</script>

<button
    class="w-full flex items-center justify-between p-4 bg-base-100 border rounded-3xl transition-all duration-200 cursor-pointer
  {selected
        ? 'border-[3px] border-base-content'
        : 'border-base-200 hover:border-base-300'}"
    on:click|preventDefault|stopPropagation={onClick}
>
    <div class="flex items-center gap-4">
        <div class="relative flex-shrink-0">
            <PairIcon
                clazz="w-6 h-6"
                claxx="w-2 h-2"
                asset0Icon={findCoinIconBySymbol(baseSymbol) || emptyToken}
                asset1Icon={findCoinIconBySymbol(quoteSymbol) || emptyToken}
            />
        </div>

        <div class="flex flex-col items-start text-left">
            <span class="text-base font-bold text-base-content">{symbol}</span>
            <div class="flex items-center gap-1">
                <span
                    class="text-[10px] text-base-content/40 font-medium tracking-wide capitalize"
                    >{exchangeName}</span
                >
            </div>
        </div>
    </div>

    <div class="flex flex-col items-end space-y-0.5">
        <span class="text-base font-bold text-base-content">{displayPrice}</span
        >
    </div>
</button>
