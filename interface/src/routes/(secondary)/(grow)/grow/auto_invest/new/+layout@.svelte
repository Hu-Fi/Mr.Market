<script>
  import GrowNewAutoInvestNav from "$lib/components/bottomNav/growNewAutoInvestNav.svelte";
import GrowNewAutoInvestBar from "$lib/components/topBar/growNewAutoInvsetBar.svelte"
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewAutoInvestBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewAutoInvestNav />


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
