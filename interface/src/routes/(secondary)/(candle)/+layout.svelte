<script>
  import CandleBar from "$lib/components/topBar/candleBar.svelte";
  import CandleNav from "$lib/components/bottomNav/candleNav.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <CandleBar />
</header>
<slot />
<CandleNav />