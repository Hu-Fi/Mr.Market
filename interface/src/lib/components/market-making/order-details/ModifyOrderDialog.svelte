<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { _ } from "svelte-i18n";

    export let isOpen = false;
    export let baseSymbol = "BTC";
    export let quoteSymbol = "USDT";
    export let currentBaseBalance = "0.00000000";
    export let currentQuoteBalance = "0.00";

    const dispatch = createEventDispatcher();

    let activeTab: "deposit" | "withdraw" = "deposit";
    let baseAmount = "";
    let quoteAmount = "";

    function close() {
        dispatch("close");
        reset();
    }

    function reset() {
        baseAmount = "";
        quoteAmount = "";
        activeTab = "deposit";
    }

    function confirm() {
        dispatch("confirm", {
            type: activeTab,
            baseAmount,
            quoteAmount,
        });
        close();
    }

    // Mock calculation for new balance
    $: newBaseBalance =
        activeTab === "deposit"
            ? (
                  parseFloat(currentBaseBalance.replace(/,/g, "")) +
                  (parseFloat(baseAmount) || 0)
              ).toFixed(8)
            : (
                  parseFloat(currentBaseBalance.replace(/,/g, "")) -
                  (parseFloat(baseAmount) || 0)
              ).toFixed(8);

    $: newQuoteBalance =
        activeTab === "deposit"
            ? (
                  parseFloat(currentQuoteBalance.replace(/,/g, "")) +
                  (parseFloat(quoteAmount) || 0)
              ).toFixed(2)
            : (
                  parseFloat(currentQuoteBalance.replace(/,/g, "")) -
                  (parseFloat(quoteAmount) || 0)
              ).toFixed(2);

    // Format numbers with commas
    const formatNumber = (num: string) => {
        const parts = num.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };
</script>

{#if isOpen}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-all"
        transition:fade={{ duration: 200 }}
        role="button"
        tabindex="0"
        on:click={close}
        on:keydown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ")
                close();
        }}
    />

    <!-- Modal Content -->
    <div
        class="fixed inset-x-0 bottom-0 z-50 w-full bg-base-100 rounded-t-[20px] md:rounded-[20px] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] overflow-hidden flex flex-col max-h-[90vh]"
        transition:slide={{ duration: 300, axis: "y" }}
    >
        <!-- Drag Handle (Mobile only visual) -->
        <div class="w-full flex justify-center pt-3 pb-1 md:hidden">
            <div class="w-10 h-1 bg-base-300 rounded-full" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4">
            <span class="text-xl font-bold text-base-content">
                {$_("modify_order")}
            </span>
            <button
                class="btn btn-circle btn-sm btn-ghost bg-base-200 text-base-content/60 hover:bg-base-300 border-none"
                on:click={close}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="px-6 pb-8 overflow-y-auto">
            <!-- Tabs -->
            <div class="bg-base-200 p-1 rounded-full flex mb-6">
                <button
                    class="flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 {activeTab ===
                    'deposit'
                        ? 'bg-base-content text-base-100 shadow-md'
                        : 'text-base-content/60 hover:text-base-content'}"
                    on:click={() => (activeTab = "deposit")}
                >
                    {$_("deposit")}
                </button>
                <button
                    class="flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 {activeTab ===
                    'withdraw'
                        ? 'bg-base-content text-base-100 shadow-md'
                        : 'text-base-content/60 hover:text-base-content'}"
                    on:click={() => (activeTab = "withdraw")}
                >
                    {$_("withdraw")}
                </button>
            </div>

            <!-- Base Asset Input -->
            <div class="mb-5">
                <div class="flex justify-between items-center mb-2">
                    <span
                        class="text-xs font-bold text-base-content/40 capitalize tracking-wide"
                        >{$_("asset_amount", {
                            values: { symbol: baseSymbol },
                        })}</span
                    >
                    <span class="text-xs font-semibold text-base-content"
                        >{$_("available_balance_value", {
                            values: { amount: currentBaseBalance },
                        })}</span
                    >
                </div>
                <div class="relative">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2">
                        <div
                            class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-base-content font-bold"
                        >
                            {baseSymbol[0]}
                        </div>
                    </div>
                    <input
                        type="number"
                        bind:value={baseAmount}
                        placeholder="0.00"
                        class="input input-lg w-full bg-base-200 border-none rounded-[20px] pl-16 text-xl font-bold text-base-content placeholder-base-content/30 focus:outline-none focus:ring-0"
                    />
                </div>
            </div>

            <!-- Quote Asset Input -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-2">
                    <span
                        class="text-xs font-bold text-base-content/40 capitalize tracking-wide"
                        >{$_("asset_amount", {
                            values: { symbol: quoteSymbol },
                        })}</span
                    >
                    <span class="text-xs font-semibold text-base-content"
                        >{$_("available_balance_value", {
                            values: { amount: currentQuoteBalance },
                        })}</span
                    >
                </div>
                <div class="relative">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2">
                        <div
                            class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-base-content font-bold"
                        >
                            {quoteSymbol[0]}
                        </div>
                    </div>
                    <input
                        type="number"
                        bind:value={quoteAmount}
                        placeholder="0.00"
                        class="input input-lg w-full bg-base-200 border-none rounded-[20px] pl-16 text-xl font-bold text-base-content placeholder-base-content/30 focus:outline-none focus:ring-0"
                    />
                </div>
            </div>

            <!-- Summary Card -->
            <div class="bg-base-200 rounded-[20px] p-5 mb-8">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-sm font-medium text-base-content/60"
                        >{$_("current_balance")}</span
                    >
                    <div class="text-right">
                        <div class="text-sm font-bold text-base-content">
                            {currentBaseBalance}
                            {baseSymbol}
                        </div>
                        <div class="text-sm font-bold text-base-content">
                            {currentQuoteBalance}
                            {quoteSymbol}
                        </div>
                    </div>
                </div>

                <div class="h-px bg-base-300 w-full mb-4"></div>

                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-base-content/60"
                        >{$_("new_balance")}</span
                    >
                    <div class="text-right">
                        <div class="text-sm font-bold text-base-content">
                            {formatNumber(newBaseBalance)}
                            {baseSymbol}
                        </div>
                        <div class="text-sm font-bold text-base-content">
                            {formatNumber(newQuoteBalance)}
                            {quoteSymbol}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
                <button
                    class="btn bg-base-content text-base-100 hover:bg-base-content/90 rounded-full h-14 border-none text-base font-bold normal-case w-full shadow-lg"
                    on:click={confirm}
                >
                    {$_("confirm_modification")}
                </button>
                <button
                    class="btn btn-ghost text-base-content/40 hover:text-base-content/60 hover:bg-transparent normal-case font-bold text-base"
                    on:click={close}
                >
                    {$_("cancel")}
                </button>
            </div>
        </div>
    </div>
{/if}
