<script lang="ts">
    import Carousel from "svelte-carousel";
    import MarketMaking from "$lib/components/home/carousel/marketMaking.svelte";
    import SimplyGrow from "$lib/components/home/carousel/simplyGrow.svelte";
    import Arbitrage from "$lib/components/home/carousel/arbitrage.svelte";

    const onPageChange = (event: CustomEvent) => {
        currentPageIndex = event.detail;
    };
    let currentPageIndex = 0;
    let totalPages = 1;
    let autoplayDuration = 3 * 1000; // 3 seconds
</script>

<div class="w-full !mt-0 border-b border-base-200 relative py-2">
    <div
        class="flex items-center justify-center absolute bottom-0 right-0 p-0.5 px-2 mb-5 mr-4 z-10 bg-base-200 rounded-2xl"
    >
        <span class="text-xs text-base-content text-opacity-60">
            {currentPageIndex + 1}
        </span>
        <span class="text-xs text-base-content text-opacity-40">
            /{totalPages}
        </span>
    </div>
    <Carousel
        autoplay
        pauseOnFocus
        dots={false}
        arrows={false}
        {autoplayDuration}
        on:pageChange={onPageChange}
    >
        <MarketMaking />
        <!-- <SimplyGrow /> -->
        <!-- <Arbitrage /> -->
    </Carousel>
</div>
