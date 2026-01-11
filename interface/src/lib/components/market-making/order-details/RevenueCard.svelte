<script lang="ts">
    import BigNumber from "bignumber.js";
    import { _ } from "svelte-i18n";

    export let totalRevenue: string;
    export let pnl: string;
    export let profitFromSpreads: string;

    $: numericPnl = new BigNumber(pnl.replace(/[^0-9.-]/g, "") || 0);
    $: isZero = numericPnl.isNaN() || numericPnl.isZero();
    $: isPositive = !isZero && numericPnl.gt(0);
</script>

<div
    class="card bg-white shadow-sm rounded-2xl p-5 mx-4 mt-4 border border-gray-50"
>
    <div class="flex justify-between items-start mb-2">
        <span
            class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
            >{$_("total_revenue")}</span
        >
        <span
            class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
            >{$_("pnl")}</span
        >
    </div>

    <div class="flex justify-between items-center mb-6">
        <div class="text-2xl font-bold text-base-content tracking-tight">
            {totalRevenue}
        </div>
        <div
            class={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-bold ${isZero ? "bg-gray-50 text-gray-400" : isPositive ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}
        >
            {#if !isZero}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class={`w-4 h-4 ${!isPositive ? "rotate-90" : ""}`}
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clip-rule="evenodd"
                    />
                </svg>
            {/if}
            {pnl}
        </div>
    </div>

    <div
        class="flex justify-between items-center text-sm pt-4 border-t border-gray-50"
    >
        <span class="text-gray-500 font-medium"
            >{$_("profit_from_spreads")}</span
        >
        <span class="font-bold text-base-content">{profitFromSpreads}</span>
    </div>
</div>
