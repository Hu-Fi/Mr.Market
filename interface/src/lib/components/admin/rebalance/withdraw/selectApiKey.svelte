<script lang="ts">
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
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
    if (!res || !res.data) {
      toast.error('Failed to load all api keys')
      return;
    }
    apiKeys = res.data;
  });
</script>

<!-- Display all available api keys -->
<div class="flex flex-wrap gap-4 p-8 pt-4">
  <SelectMixinCard path="/manage/rebalance/withdraw/mixin/" />
  {#each apiKeys as key}
    <SelectApiKeyCard info={key} path="/manage/rebalance/withdraw/exchange/" />
  {/each}
</div>