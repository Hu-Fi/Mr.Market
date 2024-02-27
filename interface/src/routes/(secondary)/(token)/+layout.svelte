<script>
  import { fade } from "svelte/transition";
  import CoinBar from "$lib/components/topBar/coinBar.svelte";
  import CoinNav from "$lib/components/bottomNav/coinNav.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <CoinBar />
</header>
<main class="mt-2 mb-20" in:fade>
  <slot />
</main>
<footer>
  <CoinNav />
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
