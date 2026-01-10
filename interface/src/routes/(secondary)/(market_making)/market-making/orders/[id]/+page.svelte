<script lang="ts">
    import StatsHeader from "$lib/components/market-making/order-details/StatsHeader.svelte";
    import RevenueCard from "$lib/components/market-making/order-details/RevenueCard.svelte";
    import BalanceCard from "$lib/components/market-making/order-details/BalanceCard.svelte";
    import DetailsCard from "$lib/components/market-making/order-details/DetailsCard.svelte";
    import FillHistory from "$lib/components/market-making/order-details/FillHistory.svelte";
    import BottomActions from "$lib/components/market-making/order-details/BottomActions.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    // Mock data fallback if API returns null/undefined (for development/demo purposes based on provided UI)
    const mockOrder = {
        symbol: "BTC/USDT",
        ordersPlaced: "12,584",
        volume: "3.8B",
        active: true,
        totalRevenue: "$1,245.80",
        pnl: "+3.24%",
        profitFromSpreads: "$892.30",
        balances: {
            base: { symbol: "BTC", amount: "1.24" },
            quote: { symbol: "USDT", amount: "15,420" },
        },
        details: {
            symbol: "BTC/USDT",
            exchange: "MEXC Global",
            orderId: "#88291...ae2",
            type: "Market Maker",
            created: "Oct 24, 14:30:05",
            totalValue: "$39,675.00",
            fees: "$12.45",
        },
        fills: [
            {
                status: "Partial Fill",
                amount: "0.225 BTC",
                time: "Today, 14:45:22",
                price: "@ $26,448.00",
            },
            {
                status: "Partial Fill",
                amount: "0.450 BTC",
                time: "Today, 14:32:10",
                price: "@ $26,450.00",
            },
        ],
    };

    $: order = data.order || mockOrder;
</script>

<div class="min-h-screen bg-gray-50 pb-10">
    <StatsHeader
        ordersPlaced={order.ordersPlaced || "0"}
        volume={order.volume || "0"}
        isActive={order.active}
    />

    <RevenueCard
        totalRevenue={order.totalRevenue || "$0.00"}
        pnl={order.pnl || "0%"}
        profitFromSpreads={order.profitFromSpreads || "$0.00"}
    />

    {#if order.balances}
        <BalanceCard
            baseSymbol={order.balances.base?.symbol || "BASE"}
            baseAmount={order.balances.base?.amount || "0"}
            quoteSymbol={order.balances.quote?.symbol || "QUOTE"}
            quoteAmount={order.balances.quote?.amount || "0"}
        />
    {/if}

    {#if order.details}
        <DetailsCard
            symbol={order.details.symbol || order.symbol}
            exchange={order.details.exchange || "Unknown"}
            orderId={order.details.orderId || "---"}
            type={order.details.type || "Market Maker"}
            created={order.details.created || ""}
            totalValue={order.details.totalValue || ""}
            fees={order.details.fees || ""}
        />
    {/if}

    {#if order.fills && order.fills.length > 0}
        <FillHistory fills={order.fills} />
    {/if}

    <BottomActions
        on:cancel={() => console.log("Cancel Order Requested")}
        on:modify={() => console.log("Modify Order Requested")}
    />
</div>
