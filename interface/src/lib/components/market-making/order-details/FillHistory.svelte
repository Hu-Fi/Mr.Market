<script lang="ts">
    import { _ } from "svelte-i18n";
    import { page } from "$app/stores";

    export let fills: Array<{
        type?: string;
        amount: string;
        time: string;
        price: string;
        status: "Partial Fill" | "Filled" | "Canceled";
    }>;
</script>

<div class="mx-4 mt-8 mb-28">
    {#if fills && fills.length > 0}
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-bold text-base-content/60 px-1">
                {$_("fill_history")}
            </h3>
            <a
                href={`/market-making/orders/${$page.params.id}/history`}
                class="text-xs font-bold text-blue-600 hover:text-blue-700"
                >{$_("view_all")}</a
            >
        </div>

        <div class="space-y-3">
            {#each fills as fill}
                <div
                    class="bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 flex justify-between items-center"
                >
                    <div class="flex items-start gap-3">
                        <div
                            class="mt-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                        ></div>
                        <div>
                            <div class="font-bold text-base-content text-sm">
                                {fill.status}
                            </div>
                            <div
                                class="text-[10px] text-base-content/40 mt-1 font-medium"
                            >
                                {fill.time}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-base-content text-sm">
                            {fill.amount}
                        </div>
                        <div
                            class="text-[10px] text-base-content/40 mt-1 font-medium"
                        >
                            {fill.price}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-bold text-base-content/60 px-1">
                {$_("fill_history")}
            </h3>
        </div>
        <div
            class="bg-base-100 rounded-2xl border-2 border-dashed border-base-200 p-8 flex flex-col items-center justify-center text-center h-[200px]"
        >
            <div
                class="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-3 text-base-content/30"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <span class="text-sm font-bold text-base-content/40"
                >{$_("no_fill_history")}</span
            >
        </div>
    {/if}
</div>
