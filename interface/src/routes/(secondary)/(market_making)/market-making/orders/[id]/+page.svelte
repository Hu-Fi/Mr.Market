<script lang="ts">
    import StatsHeader from "$lib/components/market-making/order-details/StatsHeader.svelte";
    import RevenueCard from "$lib/components/market-making/order-details/RevenueCard.svelte";
    import BalanceCard from "$lib/components/market-making/order-details/BalanceCard.svelte";
    import DetailsCard from "$lib/components/market-making/order-details/DetailsCard.svelte";
    import FillHistory from "$lib/components/market-making/order-details/FillHistory.svelte";
    import BottomActions from "$lib/components/market-making/order-details/BottomActions.svelte";
    import CancelOrderDialog from "$lib/components/market-making/order-details/CancelOrderDialog.svelte";
    import ModifyOrderModal from "$lib/components/market-making/order-details/ModifyOrderDialog.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    let showModifyModal = false;

    // Mock data fallback if API returns null/undefined (for development/demo purposes based on provided UI)
    const mockOrder = {
        symbol: "BTC/USDT",
        ordersPlaced: "842",
        volume: "1.2M",
        active: true,
        totalRevenue: "$1,240.50",
        pnl: "+12.24%",
        profitFromSpreads: "$842.20",
        balances: {
            base: { symbol: "BTC", amount: "1.24" },
            quote: { symbol: "USDT", amount: "45,420" },
        },
        details: {
            symbol: "BTC/USDT",
            exchange: "MEXC Global",
            orderId: "#88291...ae2",
            type: "Market Maker",
            created: "Oct 24, 14:30:05",
            totalValue: "$39,675.00",
            fees: "$12.50",
        },
        fills: [
            {
                amount: "0.24 BTC",
                time: "14:32:05",
                price: "64,240.50 USDT",
                status: "Filled",
            },
            {
                amount: "0.15 BTC",
                time: "14:31:12",
                price: "64,235.20 USDT",
                status: "Partial Fill",
            },
            {
                amount: "0.05 BTC",
                time: "14:30:45",
                price: "64,230.00 USDT",
                status: "Filled",
            },
        ],
    };

    $: order = data.order || mockOrder;

    let isCancelDialogOpen = false;

    function handleCancelConfirm(event: CustomEvent) {
        const { action } = event.detail;
        console.log(`Order cancellation confirmed: ${action}`);
        // TODO: Implement actual pause/close logic here
    }
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

    <FillHistory fills={order.fills || []} />

    <BottomActions
        on:cancel={() => (isCancelDialogOpen = true)}
        on:modify={() => (showModifyModal = true)}
    />

    <ModifyOrderModal
        isOpen={showModifyModal}
        currentBtcBalance={order.balances.base?.amount || "0"}
        currentUsdtBalance={order.balances.quote?.amount || "0"}
        on:close={() => (showModifyModal = false)}
        on:confirm={(e) => {
            console.log("Modify confirmed:", e.detail);
            showModifyModal = false;
        }}
    />

    <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        pair={order.symbol}
        on:close={() => (isCancelDialogOpen = false)}
        on:confirm={handleCancelConfirm}
    />
</div>
