<script>
  import GrowNewMmBar from "$lib/components/topBar/growNewMMBar.svelte";
  import SelectUnit from "$lib/components/dialogs/grow/autoInvest/selectUnit.svelte";
  import SelectPeriod from "$lib/components/dialogs/grow/autoInvest/selectPeriod.svelte";
  import GrowNewMmNav from "$lib/components/bottomNav/growNewMMNav.svelte";  
  import ConfirmPayment from "$lib/components/dialogs/grow/market_making/confirmPayment.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewMmBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewMmNav />
<ConfirmPayment />

<SelectPeriod />
<SelectUnit />

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
