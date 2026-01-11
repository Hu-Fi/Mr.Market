<script>
  import { page } from "$app/stores";
  import MixinMenu from "$lib/components/common/MixinMenu.svelte";
  import BackBar from "$lib/components/topBar/backBar.svelte";
  import { isMixin } from "$lib/helpers/mixin/mixin";
  import clsx from "clsx";

  $: path = $page.url.pathname;
</script>

<header class={clsx("sticky top-0 z-10 bg-base-100", isMixin() && "h-[36px]")}>
  {#if path !== "/market-making"}
    <BackBar />
  {/if}
  {#if path === "/market-making" && isMixin()}
    <MixinMenu />
  {/if}
</header>

<main class="p-0! h-[100vh-36px]">
  <slot />
</main>
