<script>
  import SecondTabs from "$lib/components/market/elements/secondTabs.svelte";
  import MarketBar from "$lib/components/topBar/marketBar.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <MarketBar />
  <SecondTabs />
</header>

<main class="!p-0">
  <slot />
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
