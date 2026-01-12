<script lang="ts">
    import { _ } from "svelte-i18n";
    import { formatTimestampToTime } from "$lib/helpers/utils";

    export let order: {
        id: string;
        symbol: string;
        side: "buy" | "sell";
        quantity: string;
        price: string;
        exchange: string;
        createdAt: string;
        unit: string; // e.g., BTC, ETH
        quoteUnit: string; // e.g. USDT
    };

    $: isBuy = order.side === "buy";
</script>

<div
    class="card bg-base-100 hover:shadow-lg transition-all duration-300 border border-base-200"
>
    <div class="card-body p-4 space-y-4">
        <!-- Header: Badge & Symbol & Time -->
        <div class="flex justify-between items-start">
            <div class="flex items-center space-x-3">
                <div
                    class={`badge border-none font-bold p-3 uppercase ${isBuy ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
                >
                    {order.side}
                </div>
                <div class="flex flex-col">
                    <span class="font-bold text-lg">{order.symbol}</span>
                    <span class="text-xs text-base-content/60 md:hidden block">
                        {formatTimestampToTime(order.createdAt, true, true)}
                    </span>
                </div>
            </div>
            <div class="text-sm text-base-content/60 hidden md:block">
                {formatTimestampToTime(order.createdAt, true, true)}
            </div>
        </div>

        <!-- Details: Quantity & Price -->
        <div class="flex justify-between items-center w-full">
            <div class="flex flex-col">
                <span class="text-xs text-base-content/60 mb-1">
                    {$_("quantity")}
                </span>
                <span class="font-bold text-base">
                    {order.quantity}
                    {order.unit}
                </span>
            </div>

            <div class="flex flex-col items-end">
                <span class="text-xs text-base-content/60 mb-1">
                    {$_("price")}
                </span>
                <span class="font-bold text-base">
                    {order.price}
                    {order.quoteUnit}
                </span>
            </div>
        </div>

        <!-- Footer: Exchange & ID -->
        <!-- Divider -->
        <div class="h-px bg-base-200 w-full" />

        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2 text-base-content/70">
                <!-- Generic Bank/Exchange Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                    />
                </svg>
                <span class="text-sm font-medium capitalize"
                    >{order.exchange}</span
                >
            </div>

            <div class="text-xs text-base-content/40 font-mono">
                #{order.id.slice(0, 4)}...{order.id.slice(-3)}
            </div>
        </div>
    </div>
</div>
