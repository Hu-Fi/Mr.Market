<script lang="ts">
  import SingleHealth from "$lib/components/admin/health/singleHealth.svelte";
  const items = [
    { name: "ping", state: "alive" },
    { name: "exchanges", state: "alive" },
    { name: "API keys", state: "alive" },
    { name: "errors", state: "alive" },
  ];
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-4"
>
  {#each items as item}
    <SingleHealth health={item} />
  {/each}
</div>