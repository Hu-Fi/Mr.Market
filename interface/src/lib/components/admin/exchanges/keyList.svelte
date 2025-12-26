<script lang="ts">
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import SingleApiKey from "$lib/components/admin/exchanges/singleAPIKey.svelte";
  import { createEventDispatcher } from "svelte";

  export let keys: AdminSingleKey[] = [];

  const dispatch = createEventDispatcher();

  function handleDelete(event: CustomEvent<string>) {
    dispatch("delete", event.detail);
  }
</script>

<div>
  {#each keys as key}
    <SingleApiKey {key} on:delete={handleDelete} />
  {/each}
</div>
