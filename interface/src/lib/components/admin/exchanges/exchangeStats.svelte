<script lang="ts">
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import SingleExchangeStat from "$lib/components/admin/exchanges/singleExchangeStat.svelte";

  export let keys: AdminSingleKey[] = [];
</script>

<div
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center items-center gap-4"
>
  {#if keys.length > 0}
    {#each keys as key}
      <SingleExchangeStat exchange={key} />
    {/each}
  {/if}
</div>
