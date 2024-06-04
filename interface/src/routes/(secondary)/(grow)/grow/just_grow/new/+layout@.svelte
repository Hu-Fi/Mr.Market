<script>
  import GrowNewJgBar from "$lib/components/topBar/growNewJGBar.svelte";
  import GrowNewJgNav from "$lib/components/bottomNav/growNewJGNav.svelte";
  import ConfirmPayment from "$lib/components/dialogs/grow/justGrow/confirmPayment.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <GrowNewJgBar />
</header>

<main class="!px-0 !py-0">
  <slot />
</main>

<GrowNewJgNav />
<ConfirmPayment />