<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { _ } from "svelte-i18n";
    import { fade, slide } from "svelte/transition";

    export let isOpen = false;
    export let pair = "BTC/USDT";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function selectPause() {
        dispatch("confirm", { action: "pause" });
        close();
    }

    function selectTerminate() {
        dispatch("confirm", { action: "close" });
        close();
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
            <span class="text-xl font-bold text-base-content">
                {$_("cancel_order")}
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
            <div class="text-base-content/60 mb-6 leading-relaxed">
                {@html $_("cancel_order_intro", {
                    values: {
                        pair: `<span class="font-bold text-base-content">${pair}</span>`,
                    },
                })}
            </div>

            <div class="space-y-4">
                <!-- Pause Option -->
                <button
                    class="w-full flex items-center gap-4 p-4 bg-base-200 rounded-[20px] hover:bg-base-300 transition-colors text-left group border border-transparent hover:border-base-300"
                    on:click={selectPause}
                >
                    <div
                        class="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-6 h-6 text-yellow-500"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <span class="block font-bold text-base-content mb-0.5">
                            {$_("pause_order")}
                        </span>
                        <span
                            class="block text-xs text-base-content/60 leading-snug"
                        >
                            {$_("pause_order_desc")}
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-4 h-4 text-base-content/30 group-hover:text-base-content/40"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>

                <!-- Close Option -->
                <button
                    class="w-full flex items-center gap-4 p-4 bg-base-200 rounded-[20px] hover:bg-red-50 transition-colors text-left group border border-transparent hover:border-red-100"
                    on:click={selectTerminate}
                >
                    <div
                        class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2.5"
                            stroke="currentColor"
                            class="w-6 h-6 text-red-500"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <span class="block font-bold text-red-600 mb-0.5">
                            {$_("close_order_action")}
                        </span>
                        <span
                            class="block text-xs text-base-content/60 leading-snug"
                        >
                            {$_("close_order_desc")}
                        </span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-4 h-4 text-base-content/30 group-hover:text-base-content/40"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
{/if}
