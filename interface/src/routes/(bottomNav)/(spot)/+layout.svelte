<script>
  import { page } from "$app/stores";
  import TradeBar from "$lib/components/topBar/spotBar.svelte";
</script>

{#await $page.data.growInfo}
  <div class="flex flex-col justify-center items-center space-y-4 mb-20 h-[80vh]">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{:then growInfo}
  <header class="sticky top-0 z-10 bg-base-100">
    <TradeBar />
  </header>

  <main class="!px-0 !py-0">
    <slot />
  </main>
{/await}

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
