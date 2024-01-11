<script>
  import clsx from "clsx";
  import Actions from "$lib/components/grow/marketMaking/actions.svelte";
  import GrowDetails from "$lib/components/topBar/growDetails.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100">
  <GrowDetails />
</header>

<main class={clsx("!px-0 !py-0")}>
  <slot />
</main>

<footer>
  <!-- <Actions /> -->
</footer>

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
