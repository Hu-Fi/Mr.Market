<script lang="ts">
    import { _ } from "svelte-i18n";

    export let fills: Array<{
        type?: string;
        amount: string;
        time: string;
        price: string;
        status: "Partial Fill" | "Filled" | "Canceled";
    }>;
</script>

<div class="mx-4 mt-8 mb-28">
    <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-bold text-gray-500 px-1">Fill History</h3>
        <button class="text-xs font-bold text-blue-600 hover:text-blue-700"
            >{$_("view_all")}</button
        >
    </div>

    <div class="space-y-3">
        {#each fills as fill}
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 flex justify-between items-center"
            >
                <div class="flex items-start gap-3">
                    <div
                        class="mt-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    ></div>
                    <div>
                        <div class="font-bold text-base-content text-sm">
                            {fill.status}
                        </div>
                        <div class="text-[10px] text-gray-400 mt-1 font-medium">
                            {fill.time}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-base-content text-sm">
                        {fill.amount}
                    </div>
                    <div class="text-[10px] text-gray-400 mt-1 font-medium">
                        {fill.price}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
