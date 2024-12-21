<script lang="ts">
  import { onMount } from "svelte";
  import { getAllAPIKeys } from "$lib/helpers/hufi/admin/exchange";
  import SelectApiKeyCard from "$lib/components/admin/rebalance/deposit/selectApiKeyCard.svelte";
  import SelectMixinCard from "$lib/components/admin/rebalance/deposit/selectMixinCard.svelte";

  let apiKeys = [];

  onMount(async () => {
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const res = await getAllAPIKeys(token);
    apiKeys = res.data;
  });
</script>

<!-- Display all available api keys -->
<div class="flex flex-wrap gap-4 p-8">
  <SelectMixinCard />
  {#each apiKeys as key}
    <SelectApiKeyCard info={key} />
  {/each}
</div>