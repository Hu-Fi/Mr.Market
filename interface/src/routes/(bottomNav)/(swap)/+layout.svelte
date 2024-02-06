<script>
  import SupportedExchanges from "$lib/components/swap/supportedExchanges.svelte";
import SwapBar from "$lib/components/topBar/swapBar.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <SwapBar />
</header>

<main class="!px-0 !py-2">
  <slot />
</main>

<SupportedExchanges />

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
