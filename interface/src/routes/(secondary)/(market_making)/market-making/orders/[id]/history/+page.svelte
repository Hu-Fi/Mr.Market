<script lang="ts">
    import { _ } from "svelte-i18n";
    import OrderHistoryItem from "$lib/components/grow/marketMaking/details/OrderHistoryItem.svelte";
    import { page } from "$app/stores";

    // Mock Data
    const mockOrders = [
        {
            id: "8829102391ae2",
            symbol: "BTC/USDT",
            side: "buy",
            quantity: "0.225",
            unit: "BTC",
            price: "64,448.00",
            quoteUnit: "USDT",
            exchange: "Binance",
            createdAt: new Date().toISOString(), // Today
        },
        {
            id: "77341231bc1",
            symbol: "ETH/USDT",
            side: "sell",
            quantity: "12.50",
            unit: "ETH",
            price: "2,642.50",
            quoteUnit: "USDT",
            exchange: "Coinbase",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // Today, 1 hour ago
        },
        {
            id: "5512391df4",
            symbol: "SOL/USDT",
            side: "buy",
            quantity: "150.0",
            unit: "SOL",
            price: "142.45",
            quoteUnit: "USDT",
            exchange: "Kraken",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
        {
            id: "4491029cc8",
            symbol: "BTC/USDT",
            side: "sell",
            quantity: "0.500",
            unit: "BTC",
            price: "64,100.00",
            quoteUnit: "USDT",
            exchange: "Binance",
            createdAt: new Date(Date.now() - 90000000).toISOString(), // Yesterday
        },
    ] as const;

    let searchTerm = "";
    let activeFilter: "all" | "buy" | "sell" = "all";

    $: filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.quantity.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            activeFilter === "all" || order.side === activeFilter;

        return matchesSearch && matchesFilter;
    });

    // Group by Date
    $: groupedOrders = filteredOrders.reduce(
        (groups, order) => {
            const date = new Date(order.createdAt);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let key = date.toDateString();
            if (date.toDateString() === today.toDateString()) {
                key = "today"; // i18n key or specific string
            } else if (date.toDateString() === yesterday.toDateString()) {
                key = "yesterday";
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(order);
            return groups;
        },
        {} as Record<string, (typeof mockOrders)[number][]>,
    );

    // Sort keys to maintain order (Today first)
    $: sortedGroupKeys = Object.keys(groupedOrders).sort((a, b) => {
        if (a === "today") return -1;
        if (b === "today") return 1;
        if (a === "yesterday") return -1;
        if (b === "yesterday") return 1;
        return new Date(b).getTime() - new Date(a).getTime();
    });

    $: id = $page.params.id;
</script>

<div class="flex flex-col min-h-screen bg-base-100/50 pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-base-100 pt-4 pb-2 px-4 shadow-sm">
        <!-- Search -->
        <div class="relative w-full mb-4">
            <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-5 text-base-content/40"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </div>
            <input
                type="text"
                bind:value={searchTerm}
                placeholder={$_("search_orders_placeholder") ||
                    "Search ID, Time or Quantity"}
                class="input input-bordered w-full pl-10 bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 rounded-xl"
            />
        </div>

        <!-- Tabs -->
        <div class="flex space-x-2 w-full p-1 bg-base-200/50 rounded-xl">
            <button
                class={`flex-1 btn btn-sm border-none shadow-none rounded-lg capitalize ${activeFilter === "all" ? "bg-base-100 text-base-content font-bold shadow-sm" : "bg-transparent text-base-content/60"}`}
                on:click={() => (activeFilter = "all")}
            >
                {$_("all")}
            </button>
            <button
                class={`flex-1 btn btn-sm border-none shadow-none rounded-lg capitalize ${activeFilter === "buy" ? "bg-base-100 text-base-content font-bold shadow-sm" : "bg-transparent text-base-content/60"}`}
                on:click={() => (activeFilter = "buy")}
            >
                {$_("buy_orders") || "Buy Orders"}
            </button>
            <button
                class={`flex-1 btn btn-sm border-none shadow-none rounded-lg capitalize ${activeFilter === "sell" ? "bg-base-100 text-base-content font-bold shadow-sm" : "bg-transparent text-base-content/60"}`}
                on:click={() => (activeFilter = "sell")}
            >
                {$_("sell_orders") || "Sell Orders"}
            </button>
        </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-6">
        {#each sortedGroupKeys as groupKey}
            <div class="space-y-3">
                <span
                    class="text-sm font-semibold text-base-content/50 capitalize px-1 block"
                >
                    {#if groupKey === "today"}
                        {$_("today")}
                    {:else if groupKey === "yesterday"}
                        {$_("yesterday")}
                    {:else}
                        {groupKey}
                    {/if}
                </span>

                <div class="grid gap-4">
                    {#each groupedOrders[groupKey] as order (order.id)}
                        <OrderHistoryItem {order} />
                    {/each}
                </div>
            </div>
        {/each}

        {#if filteredOrders.length === 0}
            <div
                class="flex flex-col items-center justify-center py-20 opacity-50 space-y-4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-16"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                </svg>
                <span>{$_("no_orders_found") || "No orders found"}</span>
            </div>
        {/if}
    </div>
</div>
