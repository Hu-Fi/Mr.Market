<script>
  import { isMixin } from "$lib/helpers/mixin";
  import clsx from "clsx";
</script>

<header class={clsx("sticky top-0 z-10 bg-base-100", isMixin() && 'h-[36px]')} />

<main class="!p-0 h-[100vh-36px]">
  <slot />
</main>