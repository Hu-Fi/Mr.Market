<script lang="ts">
    import ChooseTradingPairSmallBtn from "./chooseTradingPairSmallBtn.svelte";
    import type { MarketMakingPair } from "$lib/types/hufi/grow";
    import { _ } from "svelte-i18n";

    export let pairs: MarketMakingPair[] = [];
    export let exchangeName = "";
    export let selectedPair: string | null = null;
    export let onSelect: (symbol: string) => void = () => {};
</script>

<div class="flex-1 w-full px-6 overflow-y-auto space-y-3">
    {#each pairs as pair (pair.id || pair.symbol)}
        <ChooseTradingPairSmallBtn
            {pair}
            {exchangeName}
            selected={pair.symbol === selectedPair}
            onClick={() => onSelect(pair.symbol)}
        />
    {/each}
    {#if pairs.length === 0}
        <div class="text-center text-base-content/40 py-10">
            {$_("no_trading_pairs_found")}
        </div>
    {/if}
</div>
