<script lang="ts">
  import clsx from "clsx";
  import { page } from "$app/stores";
  import GrowDetails from "$lib/components/topBar/growDetails.svelte";
  import ArbitrageStatusNav from "$lib/components/bottomNav/arbitrageStatusNav.svelte";

  import { derived } from 'svelte/store';
  import type { Page } from '@sveltejs/kit';
  import MarketMakingStatusNav from "$lib/components/bottomNav/marketMakingStatusNav.svelte";
  import EditArbitrageDialog from "$lib/components/dialogs/grow/arbitrage/editArbitrage.svelte";
  import EditMarketMakingDialog from "$lib/components/dialogs/grow/market_making/editMarketMaking.svelte";

  const isArbitragePage = derived(page, ($page: Page) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pathSegments = $page.url.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 3 && pathSegments[0] === 'grow' && pathSegments[1] === 'arbitrage') {
      return uuidRegex.test(pathSegments[2]);
    }
    return false;
  });

  const isMarketMakingPage = derived(page, ($page: Page) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pathSegments = $page.url.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 3 && pathSegments[0] === 'grow' && pathSegments[1] === 'market_making') {
      return uuidRegex.test(pathSegments[2]);
    }
    return false;
  });
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <GrowDetails titleLeft={$isArbitragePage} />
</header>

<main class={clsx("!px-0 !py-0", {'arbitrage-title': !$isArbitragePage})}>
  <slot />
</main>

{#if $isArbitragePage}
  <ArbitrageStatusNav />
{:else if $isMarketMakingPage }
  <MarketMakingStatusNav />
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
