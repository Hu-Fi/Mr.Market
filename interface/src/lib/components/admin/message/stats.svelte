<script lang="ts">
  import { _ } from "svelte-i18n"
  const items = [
    { name: $_('message_count'), state: "123123" },
    // { name: "exchanges", state: "alive" },
    // { name: "API keys", state: "alive" },
  ];
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-4"
>
  {#each items as item}
  <div class="stats shadow">  
    <div class="stat">
      <div class="stat-title">
        <span class="capitalize">{item.name}</span>
      </div>

      <div class="stat-value text-green-500 my-1 mr-2">{item.state}</div>
    </div>
  </div>
  {/each}
</div>