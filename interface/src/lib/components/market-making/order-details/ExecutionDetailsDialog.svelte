<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { _ } from "svelte-i18n";

    export let isOpen = false;
    // Mock data for now, these can be props if dynamic data is needed
    export let totalOrders = "12,584";
    export let executedOrders = "12,242";
    export let successRate = "97.3%";
    export let canceledOrders = "342";
    export let canceledRate = "2.7%";
    export let totalVolume = "458,291.50";
    export let volumeCurrency = "Usdt";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }
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
            <span class="text-lg font-bold text-base-content">
                {$_("execution_details")}
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
            <!-- Total Orders -->
            <div class="flex flex-col items-center mb-6">
                <span
                    class="text-4xl font-extrabold text-base-content tracking-tight"
                >
                    {totalOrders}
                </span>
                <span
                    class="text-sm font-medium text-base-content/60 mt-1 capitalize tracking-wide"
                >
                    {$_("total_orders_created")}
                </span>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
                <!-- Executed -->
                <div class="bg-base-100 border border-base-200 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <div
                            class="w-5 h-5 rounded-full bg-base-content flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-3 h-3 text-base-100"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <span class="text-sm font-bold text-base-content"
                            >{$_("executed")}</span
                        >
                    </div>
                    <div class="text-2xl font-bold text-base-content">
                        {executedOrders}
                    </div>
                    <div
                        class="text-xs font-semibold text-base-content/60 mt-1"
                    >
                        {successRate}
                        {$_("success")}
                    </div>
                </div>

                <!-- Canceled -->
                <div class="bg-base-100 border border-base-200 rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <div
                            class="w-5 h-5 rounded-full bg-base-content/60 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-3 h-3 text-base-100"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <span class="text-sm font-bold text-base-content"
                            >{$_("canceled")}</span
                        >
                    </div>
                    <div class="text-2xl font-bold text-base-content">
                        {canceledOrders}
                    </div>
                    <div
                        class="text-xs font-semibold text-base-content/60 mt-1"
                    >
                        {canceledRate}
                        {$_("rate")}
                    </div>
                </div>
            </div>

            <!-- Total Volume -->
            <div
                class="bg-base-100 border border-base-200 rounded-2xl p-6 text-center mb-6"
            >
                <div class="text-sm font-bold text-base-content/60 mb-2">
                    {$_("total_volume")}
                </div>
                <div
                    class="text-3xl font-extrabold text-base-content tracking-tight"
                >
                    {totalVolume}
                </div>
                <div class="text-sm font-bold text-base-content/40 mt-1">
                    {volumeCurrency}
                </div>
            </div>

            <!-- Actions -->
            <button
                class="btn bg-black text-white hover:bg-black/90 rounded-full h-14 border-none text-base font-bold normal-case w-full shadow-lg"
                on:click={close}
            >
                {$_("done")}
            </button>
        </div>
    </div>
{/if}
