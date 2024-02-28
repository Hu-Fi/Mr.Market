<script>
  import { correct } from "$lib/stores/admin";
  import Login from "$lib/components/admin/login.svelte";
  import Dashboard from "$lib/components/admin/dashboard.svelte";
    import clsx from "clsx";
</script>

<div class={clsx("flex w-full items-center justify-center", !$correct && 'h-full')}>
  {#if $correct}
    <Dashboard />
  {:else}
    <Login />
  {/if}
</div>