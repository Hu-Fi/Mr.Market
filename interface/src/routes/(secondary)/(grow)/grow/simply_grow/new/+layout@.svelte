<script>
  import GrowNewSgBar from "$lib/components/topBar/growNewSGBar.svelte";
  import GrowNewSgNav from "$lib/components/bottomNav/growNewSGNav.svelte";
  import ConfirmPayment from "$lib/components/dialogs/grow/simplyGrow/confirmPayment.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewSgBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewSgNav />
<ConfirmPayment />