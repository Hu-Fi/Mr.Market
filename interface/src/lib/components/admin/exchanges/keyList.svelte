<script lang="ts">
	import type { AdminSingleKey } from '$lib/types/hufi/admin';
  import SingleApiKey from "$lib/components/admin/exchanges/singleAPIKey.svelte"
  
  export let keys: AdminSingleKey[] = [];
</script>

<div>
  {#if keys.length > 0}
    {#each keys as key}
      <SingleApiKey key={key} />
    {/each}
  {/if}
</div>