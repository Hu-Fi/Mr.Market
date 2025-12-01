<script>
  import GrowNewMmBar from "$lib/components/topBar/growNewMMBar.svelte";
  import GrowNewMmNav from "$lib/components/bottomNav/growNewMMNav.svelte";
  import ConfirmPayment from "$lib/components/dialogs/market-making/confirmPayment.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewMmBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewMmNav />
<ConfirmPayment />
