<script>
  import { goto } from "$app/navigation";
  import { correct } from "$lib/stores/admin";
  import SideBar from "$lib/components/admin/dashboard/sideBar.svelte";
  import clsx from "clsx";

  if (!$correct) {
    goto("/manage/login");
  } else {
    goto("/manage/dashboard");
  }
</script>

<main class="!px-0 !py-0 h-[100vh]">
  {#if $correct}
    <SideBar />
  {/if}
  <div class={clsx($correct ? "lg:ml-64" : "h-[100vh]")}>
    <slot />
  </div>
</main>
