<script lang="ts">
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import SingleApiKey from "$lib/components/admin/exchanges/singleAPIKey.svelte";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  export let keys: AdminSingleKey[] = [];

  const dispatch = createEventDispatcher();

  function handleDelete(event: CustomEvent<string>) {
    dispatch("delete", event.detail);
  }

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 4;
  $: totalPages = Math.ceil(keys.length / itemsPerPage);
  $: paginatedKeys = keys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
</script>

<div class="overflow-x-auto">
  <table class="table table-lg">
    <thead class="bg-base-200/50 text-base-content/70">
      <tr>
        <th class="uppercase text-xs font-semibold">{$_("exchange")}</th>
        <th class="uppercase text-xs font-semibold"
          >{$_("label")} / {$_("key_id")}</th
        >
        <th class="uppercase text-xs font-semibold">{$_("permissions")}</th>
        <th class="uppercase text-xs font-semibold">{$_("created")}</th>
        <th class="uppercase text-xs font-semibold">{$_("status")}</th>
        <th class="text-right uppercase text-xs font-semibold"
          >{$_("actions")}</th
        >
      </tr>
    </thead>
    <tbody>
      {#each paginatedKeys as key (key.key_id)}
        <SingleApiKey {key} on:delete={handleDelete} />
      {/each}
    </tbody>
  </table>
</div>

<!-- Pagination -->
<div
  class="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-100"
>
  <div class="text-sm text-base-content/60">
    {$_("showing")}
    <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
    {$_("to")}
    <span class="font-medium"
      >{Math.min(currentPage * itemsPerPage, keys.length)}</span
    >
    {$_("of")} <span class="font-medium">{keys.length}</span>
    {$_("results")}
  </div>
  <div class="join">
    <button
      class="join-item btn btn-sm"
      disabled={currentPage === 1}
      on:click={() => (currentPage = Math.max(1, currentPage - 1))}
    >
      «
    </button>
    {#each Array(totalPages) as _, i}
      {#if totalPages <= 5 || i === 0 || i === totalPages - 1 || Math.abs(i + 1 - currentPage) <= 1}
        <button
          class="join-item btn btn-sm {currentPage === i + 1
            ? 'btn-active'
            : ''}"
          on:click={() => (currentPage = i + 1)}
        >
          {i + 1}
        </button>
      {:else if Math.abs(i + 1 - currentPage) === 2}
        <button class="join-item btn btn-sm btn-disabled">...</button>
      {/if}
    {/each}
    <button
      class="join-item btn btn-sm"
      disabled={currentPage === totalPages}
      on:click={() => (currentPage = Math.min(totalPages, currentPage + 1))}
    >
      »
    </button>
  </div>
</div>
