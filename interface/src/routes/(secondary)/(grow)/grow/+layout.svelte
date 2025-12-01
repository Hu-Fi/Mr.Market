<script lang="ts">
  import clsx from "clsx";
  import GrowDetails from "$lib/components/topBar/growDetails.svelte";
  import {
    isArbitragePage,
    isSimplyGrowPage,
    isMarketMakingPage,
  } from "$lib/stores/grow";
  import ArbitrageStatusNav from "$lib/components/bottomNav/arbitrageStatusNav.svelte";
  import MarketMakingStatusNav from "$lib/components/bottomNav/marketMakingStatusNav.svelte";
  import EditArbitrageDialog from "$lib/components/dialogs/grow/arbitrage/editArbitrage.svelte";
  import EditMarketMakingDialog from "$lib/components/dialogs/market-making/editMarketMaking.svelte";
</script>

<header class="sticky top-0 z-20 bg-base-100">
  <GrowDetails />
</header>

<main class={clsx("!px-0 !py-0", { "arbitrage-title": !$isArbitragePage })}>
  <slot />
</main>

{#if $isArbitragePage}
  <ArbitrageStatusNav />
{:else if $isMarketMakingPage}
  <MarketMakingStatusNav />
{:else if $isSimplyGrowPage}
  <!--  -->
{/if}

<EditArbitrageDialog />
<EditMarketMakingDialog />

<style>
  .arbitrage-title {
    max-width: 64rem;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
