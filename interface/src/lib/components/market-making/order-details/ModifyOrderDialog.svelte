<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { _ } from "svelte-i18n";

    export let isOpen = false;
    export let currentBtcBalance = "0.45000000";
    export let currentUsdtBalance = "12,450.00";

    const dispatch = createEventDispatcher();

    let activeTab: "deposit" | "withdraw" = "deposit";
    let btcAmount = "";
    let usdtAmount = "";

    function close() {
        dispatch("close");
        reset();
    }

    function reset() {
        btcAmount = "";
        usdtAmount = "";
        activeTab = "deposit";
    }

    function confirm() {
        dispatch("confirm", {
            type: activeTab,
            btcAmount,
            usdtAmount,
        });
        close();
    }

    // Mock calculation for new balance
    $: newBtcBalance =
        activeTab === "deposit"
            ? (
                  parseFloat(currentBtcBalance.replace(/,/g, "")) +
                  (parseFloat(btcAmount) || 0)
              ).toFixed(8)
            : (
                  parseFloat(currentBtcBalance.replace(/,/g, "")) -
                  (parseFloat(btcAmount) || 0)
              ).toFixed(8);

    $: newUsdtBalance =
        activeTab === "deposit"
            ? (
                  parseFloat(currentUsdtBalance.replace(/,/g, "")) +
                  (parseFloat(usdtAmount) || 0)
              ).toFixed(2)
            : (
                  parseFloat(currentUsdtBalance.replace(/,/g, "")) -
                  (parseFloat(usdtAmount) || 0)
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
        class="fixed inset-x-0 bottom-0 z-50 w-full bg-white rounded-t-[20px] md:rounded-[20px] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] overflow-hidden flex flex-col max-h-[90vh]"
        transition:slide={{ duration: 300, axis: "y" }}
    >
        <!-- Drag Handle (Mobile only visual) -->
        <div class="w-full flex justify-center pt-3 pb-1 md:hidden">
            <div class="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4">
            <h2 class="text-xl font-bold text-gray-900">Modify Order</h2>
            <button
                class="btn btn-circle btn-sm btn-ghost bg-gray-100 text-gray-500 hover:bg-gray-200 border-none"
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
            <div class="bg-gray-50 p-1 rounded-full flex mb-6">
                <button
                    class="flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 {activeTab ===
                    'deposit'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-900'}"
                    on:click={() => (activeTab = "deposit")}
                >
                    Deposit
                </button>
                <button
                    class="flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all duration-200 {activeTab ===
                    'withdraw'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-900'}"
                    on:click={() => (activeTab = "withdraw")}
                >
                    Withdraw
                </button>
            </div>

            <!-- BTC Input -->
            <div class="mb-5">
                <div class="flex justify-between items-center mb-2">
                    <span
                        class="text-xs font-bold text-gray-400 uppercase tracking-wide"
                        >BTC Amount</span
                    >
                    <span class="text-xs font-semibold text-gray-900"
                        >Available: {currentBtcBalance}</span
                    >
                </div>
                <div class="relative">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2">
                        <div
                            class="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                ><path
                                    d="M17.34 9.39H15.8V7.3h-1.63v2.09c-.43 0-.87-.02-1.3-.05V7.3h-1.63v1.94c-.36-.02-.7-.04-1.04-.05l.02-2.12-2.73 1.05v1.07h-1.6v.77c.48.11.85.34.85.76v8.27c0 .42-.37.66-.85.76v.76h1.63v3.73l2.74-1.09-.04-2.54c.34 0 .68-.02 1.03-.04v2.02h1.63v-2.09c.45.03.89.05 1.32.06v2.09h1.63v-2.14c2.81.21 5.37-1.11 5.37-4.52 0-1.68-.82-2.61-1.89-3.08 1.05-.44 1.73-1.35 1.73-2.67 0-2.38-1.86-3.73-4.43-3.92zM10.95 11.23h1.86c1.32 0 2.22.4 2.22 1.48 0 1.06-.9 1.55-2.22 1.55h-1.86V11.23zM13.2 16.7H10.95v-3.15h2.25c1.55 0 2.44.47 2.44 1.55 0 1.12-.89 1.6-2.44 1.6z"
                                /></svg
                            >
                        </div>
                    </div>
                    <input
                        type="number"
                        bind:value={btcAmount}
                        placeholder="0.00"
                        class="input input-lg w-full bg-gray-50 border-none rounded-[20px] pl-16 text-xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-0"
                    />
                </div>
            </div>

            <!-- USDT Input -->
            <div class="mb-8">
                <div class="flex justify-between items-center mb-2">
                    <span
                        class="text-xs font-bold text-gray-400 uppercase tracking-wide"
                        >USDT Amount</span
                    >
                    <span class="text-xs font-semibold text-gray-900"
                        >Available: {currentUsdtBalance}</span
                    >
                </div>
                <div class="relative">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2">
                        <div
                            class="w-8 h-8 rounded-full bg-[#009393] flex items-center justify-center text-white font-bold text-lg"
                        >
                            $
                        </div>
                    </div>
                    <input
                        type="number"
                        bind:value={usdtAmount}
                        placeholder="0.00"
                        class="input input-lg w-full bg-gray-50 border-none rounded-[20px] pl-16 text-xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-0"
                    />
                </div>
            </div>

            <!-- Summary Card -->
            <div class="bg-gray-50 rounded-[20px] p-5 mb-8">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-sm font-medium text-gray-500"
                        >Current Balance</span
                    >
                    <div class="text-right">
                        <div class="text-sm font-bold text-gray-900">
                            {currentBtcBalance} BTC
                        </div>
                        <div class="text-sm font-bold text-gray-900">
                            {currentUsdtBalance} USDT
                        </div>
                    </div>
                </div>

                <div class="h-px bg-gray-200 w-full mb-4"></div>

                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-gray-500"
                        >New Balance</span
                    >
                    <div class="text-right">
                        <div class="text-sm font-bold text-gray-900">
                            {formatNumber(newBtcBalance)} BTC
                        </div>
                        <div class="text-sm font-bold text-gray-900">
                            {formatNumber(newUsdtBalance)} USDT
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3">
                <button
                    class="btn bg-black text-white hover:bg-gray-900 rounded-full h-14 border-none text-base font-bold normal-case w-full shadow-lg"
                    on:click={confirm}
                >
                    Confirm Modification
                </button>
                <button
                    class="btn btn-ghost text-gray-400 hover:text-gray-600 hover:bg-transparent normal-case font-bold text-base"
                    on:click={close}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}
