<script lang="ts">
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    export let ordersPlaced: number | string;
    export let volume: string;
    export let isActive: boolean = true;

    const dispatch = createEventDispatcher();
</script>

<div
    class="flex flex-col items-center py-6 bg-base-100 cursor-pointer select-none active:bg-base-200 transition-colors"
    on:click={() => dispatch("click")}
    role="button"
    tabindex="0"
    on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") dispatch("click");
    }}
>
    {#if isActive}
        <div
            class="px-3 py-1 bg-green-50 text-green-500 font-bold text-xs rounded-md mb-4 uppercase tracking-wide"
        >
            {$_("active")}
        </div>
    {/if}

    <div class="flex w-full justify-center">
        <div class="flex-1 text-center border-r border-base-200">
            <div class="text-xl font-bold text-base-content">
                {ordersPlaced}
            </div>
            <div class="text-xs font-medium text-base-content/60 mt-1">
                {$_("orders_placed")}
            </div>
        </div>
        <div class="flex-1 text-center">
            <div class="text-xl font-bold text-base-content">{volume}</div>
            <div class="text-xs font-medium text-base-content/60 mt-1">
                {$_("volume")}
            </div>
        </div>
    </div>
</div>
