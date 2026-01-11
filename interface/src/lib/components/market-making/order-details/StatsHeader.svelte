<script lang="ts">
    import { _ } from "svelte-i18n";

    export let ordersPlaced: number | string;
    export let volume: string;
    export let isActive: boolean = true;
</script>

<div class="flex flex-col items-center py-6 bg-white">
    {#if isActive}
        <div
            class="px-3 py-1 bg-green-50 text-green-500 font-bold text-xs rounded-md mb-4 uppercase tracking-wide"
        >
            {$_("active")}
        </div>
    {/if}

    <div class="flex w-full justify-center">
        <div class="flex-1 text-center border-r border-gray-100">
            <div class="text-xl font-bold text-gray-900">{ordersPlaced}</div>
            <div class="text-xs font-medium text-gray-500 mt-1">
                {$_("orders_placed")}
            </div>
        </div>
        <div class="flex-1 text-center">
            <div class="text-xl font-bold text-gray-900">{volume}</div>
            <div class="text-xs font-medium text-gray-500 mt-1">
                {$_("volume")}
            </div>
        </div>
    </div>
</div>
