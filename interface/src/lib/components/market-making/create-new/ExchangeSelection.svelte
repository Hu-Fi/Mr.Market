<script lang="ts">
    import { _ } from "svelte-i18n";
    import ExchangeCard from "./ExchangeCard.svelte";

    export let exchanges: { exchange_id: string; name: string }[] = [];
    export let selectedExchange: string | null = null;
    export let onSelect: (exchangeId: string) => void;
    export let onContinue: () => void;

    let searchQuery = "";

    $: filteredExchanges = exchanges.filter(
        (e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.exchange_id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
</script>

<div class="flex flex-col h-full w-full mt-6">
    <label
        class="input input-lg text-sm w-full mb-8 rounded-full bg-base-200 border-0.5 border-base-200 focus-within:border-base-200 focus-within:outline-none flex items-center gap-2"
    >
        <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input
            type="search"
            placeholder={$_("search")}
            bind:value={searchQuery}
            required
        />
    </label>

    <div class="grid grid-cols-2 gap-6 w-full overflow-y-auto max-h-[50vh]">
        {#each filteredExchanges as exchange}
            <ExchangeCard
                exchangeName={exchange.name}
                selected={selectedExchange === exchange.exchange_id}
                status={selectedExchange === exchange.exchange_id
                    ? $_("status_selected")
                    : $_("status_available")}
                onClick={() => onSelect(exchange.exchange_id)}
            />
        {/each}
        {#if filteredExchanges.length === 0}
            <div class="col-span-2 text-center text-base-content/40 py-10">
                {$_("no_exchanges_found")}
            </div>
        {/if}
    </div>

    <div
        class="fixed bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none"
    >
        <button
            class="btn btn-xl pointer-events-auto bg-base-content text-base-100 px-16 py-4 rounded-full text-lg font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-content/80 transition-colors"
            disabled={!selectedExchange}
            on:click={onContinue}
        >
            {$_("continue_to_trading_pair")}
        </button>
    </div>
</div>
