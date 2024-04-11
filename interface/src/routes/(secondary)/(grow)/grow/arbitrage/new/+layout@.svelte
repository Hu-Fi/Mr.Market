<script>
  import { _ } from "svelte-i18n";
  import GrowNewArbBar from "$lib/components/topBar/growNewArbBar.svelte";
  import GrowNewArbNav from "$lib/components/bottomNav/growNewArbNav.svelte";
  import SelectExchange from "$lib/components/dialogs/grow/arbitrage/selectExchange.svelte";
  import SelectPair from "$lib/components/dialogs/grow/arbitrage/selectPair.svelte";
  import ConfirmPayment from "$lib/components/dialogs/grow/arbitrage/confirmPayment.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewArbBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewArbNav btnText={$_('create_arbitrage')} />
<SelectExchange type=1 />
<SelectExchange type=2 />
<SelectPair />
<ConfirmPayment />

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
