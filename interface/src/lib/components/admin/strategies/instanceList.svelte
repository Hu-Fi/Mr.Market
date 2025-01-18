<script>
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { fetchAllStrategies } from "$lib/helpers/hufi/admin/strategies";
  let strategies = [];

  onMount(async () => {
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    try {
      const resp = await fetchAllStrategies(token);
      console.log("resp", resp);
      if (!resp) {
        throw Error("Failed to fetch strategies");
      }
      if (resp.length === 0) {
        return;
      }
      strategies = resp;
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  });
</script>

<div class="py-4 pt-0 space-y-4">
  <div class="text-xl font-bold">{$_("strategy_instances")}</div>
  {#if strategies.length === 0}
    <div class="text-center py-12">
      <span class="">
        {$_("no_strategy_instance")}
      </span>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Strategy Key</th>
            <th>User ID</th>
            <th>Client ID</th>
            <th>Strategy Type</th>
            <th>Parameters</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {#each strategies as strategy}
            <tr>
              <td>{strategy.id}</td>
              <td>{strategy.strategyKey}</td>
              <td>{strategy.userId}</td>
              <td>{strategy.clientId}</td>
              <td>{strategy.strategyType}</td>
              <td>{JSON.stringify(strategy.parameters)}</td>
              <td>{strategy.status}</td>
              <td>{new Date(strategy.createdAt).toLocaleString()}</td>
              <td>{new Date(strategy.updatedAt).toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
