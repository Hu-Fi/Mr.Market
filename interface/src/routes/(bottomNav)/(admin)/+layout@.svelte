<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { correct } from "$lib/stores/admin";
  import Login from "$lib/components/admin/login.svelte";
  import { autoCheckPassword } from "$lib/helpers/mrm/admin";
  import SideBar from "$lib/components/admin/dashboard/sideBar.svelte";

  onMount(() => {
    autoCheckPassword($page.url.pathname);
  });
</script>

<main class="!px-0 !py-0 h-[100vh]">
  {#if $correct}
    <SideBar />
    <div class="lg:ml-64">
      <slot />
    </div>
  {:else}
    <div class="h-[100vh] flex justify-center items-center">
      <Login />
    </div>
  {/if}
</main>
