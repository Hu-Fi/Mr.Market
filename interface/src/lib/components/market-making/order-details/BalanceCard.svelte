<script lang="ts">
    export let baseSymbol: string;
    export let quoteSymbol: string;
    export let baseAmount: string | number;
    export let quoteAmount: string | number;
</script>

<div class="mx-4 mt-8">
    <h3 class="text-sm font-bold text-gray-500 mb-3 px-1">Current Balance</h3>

    <div
        class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
    >
        <!-- Item 1 -->
        <div
            class="flex items-center justify-between p-4 border-b border-gray-50"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                >
                    <span class="text-[10px] font-bold">{baseSymbol[0]}</span>
                </div>
                <span class="font-bold text-gray-600">{baseSymbol}</span>
            </div>
            <span class="font-bold text-base-content text-lg">{baseAmount}</span
            >
        </div>

        <!-- Item 2 -->
        <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
                <div
                    class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                >
                    <span class="text-[10px] font-bold">{quoteSymbol[0]}</span>
                </div>
                <span class="font-bold text-gray-600">{quoteSymbol}</span>
            </div>
            <span class="font-bold text-base-content text-lg"
                >{quoteAmount}</span
            >
        </div>
    </div>
</div>
