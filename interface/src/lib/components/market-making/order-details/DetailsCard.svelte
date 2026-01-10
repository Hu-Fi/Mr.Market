<script lang="ts">
    import { _ } from "svelte-i18n";

    export let symbol: string;
    export let exchange: string;
    export let orderId: string;
    export let type: string;
    export let created: string;
    export let totalValue: string;
    export let fees: string;
</script>

<div class="mx-4 mt-8">
    <h3 class="text-sm font-bold text-gray-500 mb-3 px-1">Order Details</h3>

    <div
        class="bg-white rounded-2xl shadow-sm border border-gray-50 p-5 space-y-6"
    >
        <!-- Symbol -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("symbol")}</span>
            </div>
            <span class="font-bold text-base-content">{symbol}</span>
        </div>

        <!-- Exchange -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("exchange")}</span>
            </div>
            <span class="font-bold text-base-content">{exchange}</span>
        </div>

        <!-- Order ID -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-2.25 2.25v2.25A2.25 2.25 0 002.41 15.75h4.636a2.25 2.25 0 001.872-1.002l.164-.246a2.25 2.25 0 011.872-1.002h2.092a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h4.636a2.25 2.25 0 002.25-2.25v-2.25a2.25 2.25 0 00-2.25-2.25h-4.636"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("order_id")}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="font-medium text-base-content/80 text-sm"
                    >{orderId}</span
                >
                <button class="text-base-content/80 transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-4 h-4"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5"
                        /></svg
                    >
                </button>
            </div>
        </div>

        <!-- Type -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("type")}</span>
            </div>
            <span class="font-bold text-base-content">{type}</span>
        </div>

        <!-- Created -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("created")}</span>
            </div>
            <span class="font-bold text-base-content">{created}</span>
        </div>

        <!-- Total Value -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    /></svg
                >
                <span class="text-sm font-bold">{$_("total_value")}</span>
            </div>
            <span class="font-bold text-base-content">{totalValue}</span>
        </div>

        <!-- Fees -->
        <div class="flex justify-between items-center group">
            <div
                class="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
                <div class="w-5 flex justify-center items-center">
                    <span
                        class="font-serif italic font-bold text-lg leading-none"
                        >$</span
                    >
                </div>
                <span class="text-sm font-bold">{$_("fees")}</span>
            </div>
            <span class="font-bold text-base-content">{fees}</span>
        </div>
    </div>
</div>
