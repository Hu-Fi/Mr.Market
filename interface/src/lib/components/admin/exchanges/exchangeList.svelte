<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { invalidate } from "$app/navigation";
  import {
    updateExchange,
    removeExchange,
  } from "$lib/helpers/mrm/admin/growdata";

  export let exchanges: {
    exchange_id: string;
    name: string;
    icon_url?: string;
    enable: boolean;
  }[] = [];
  export let supportedExchanges: string[] = [];

  let updatingIds: Record<string, boolean> = {};
  let deletingIds: Record<string, boolean> = {};

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;
  $: totalPages = Math.ceil(exchanges.length / itemsPerPage);
  $: paginatedExchanges = exchanges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function UpdateExchange(
    exchange_id: string,
    name: string,
    enable: boolean,
    iconUrl: string,
  ) {
    if (!exchange_id) return;
    updatingIds = { ...updatingIds, [exchange_id]: true };
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      updatingIds = { ...updatingIds, [exchange_id]: false };
      return;
    }

    try {
      await updateExchange(
        exchange_id,
        { exchange_id, name, enable, icon_url: iconUrl },
        token,
      );
    } catch (error) {
      console.error("Failed to update exchange:", error);
      updatingIds = { ...updatingIds, [exchange_id]: false };
      return;
    }

    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        updatingIds = { ...updatingIds, [exchange_id]: false };
      });
    }, getRandomDelay());
  }

  async function DeleteExchange(exchange_id: string) {
    if (!exchange_id) return;
    deletingIds = { ...deletingIds, [exchange_id]: true };
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      deletingIds = { ...deletingIds, [exchange_id]: false };
      return;
    }

    try {
      await removeExchange(exchange_id, token);
    } catch (error) {
      console.error("Failed to delete exchange:", error);
      deletingIds = { ...deletingIds, [exchange_id]: false };
      return;
    }

    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        deletingIds = { ...deletingIds, [exchange_id]: false };
      });
    }, getRandomDelay());
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
  }
</script>

{#if !exchanges}
  <div
    class="w-full h-64 flex flex-col justify-center items-center gap-4 text-base-content/40"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-12 h-12"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
    <p>{$_("failed_to_load_data")}</p>
    <button
      class="btn btn-sm btn-ghost"
      on:click={() => window.location.reload()}
    >
      {$_("reload")}
    </button>
  </div>
{:else}
  <div
    class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="table table-lg">
        <thead class="bg-base-200/50 text-base-content/70">
          <tr>
            <th class="uppercase text-xs font-semibold">{$_("icon")}</th>
            <th class="uppercase text-xs font-semibold">{$_("display_name")}</th
            >
            <th class="uppercase text-xs font-semibold">{$_("exchange_id")}</th>
            <th class="text-center uppercase text-xs font-semibold"
              >{$_("supported")}</th
            >
            <th class="text-center uppercase text-xs font-semibold"
              >{$_("status")}</th
            >
            <th class="text-right uppercase text-xs font-semibold"
              >{$_("actions")}</th
            >
          </tr>
        </thead>
        <tbody>
          {#if paginatedExchanges.length === 0}
            <tr>
              <td colspan="6" class="text-center py-12 text-base-content/40">
                {$_("no_exchanges_found")}
              </td>
            </tr>
          {/if}

          {#each paginatedExchanges as exchange}
            <tr class="hover:bg-base-200/30 transition-colors">
              <td class="p-3">
                {#if exchange.icon_url}
                  <div class="w-full h-full rounded-xl bg-base-100 min-w-12">
                    <img src={exchange.icon_url} alt={exchange.name} />
                  </div>
                {:else}
                  <div class="avatar placeholder">
                    <div
                      class="bg-neutral text-neutral-content rounded-xl w-10 h-10"
                    >
                      <span class="text-xs"
                        >{exchange.name.substring(0, 2).toUpperCase()}</span
                      >
                    </div>
                  </div>
                {/if}
              </td>
              <td class="font-medium">{exchange.name}</td>
              <td
                ><code class="badge badge-ghost badge-sm font-mono"
                  >{exchange.exchange_id}</code
                ></td
              >
              <td class="text-center">
                {#if supportedExchanges.includes(exchange.exchange_id)}
                  <div class="badge badge-success badge-sm gap-1 text-base-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-3 h-3"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {$_("supported")}
                  </div>
                {:else}
                  <div class="badge badge-error text-base-content/80 badge-sm">
                    {$_("unsupported")}
                  </div>
                {/if}
              </td>
              <td class="text-center">
                <button
                  class={clsx(
                    "btn btn-xs btn-circle transition-all",
                    exchange.enable
                      ? "btn-success text-white"
                      : "btn-ghost text-base-content",
                  )}
                  on:click={async () => {
                    const newEnable = !exchange.enable;
                    await UpdateExchange(
                      exchange.exchange_id,
                      exchange.name,
                      newEnable,
                      exchange.icon_url || "",
                    );
                  }}
                  disabled={!!updatingIds[exchange.exchange_id]}
                >
                  {#if updatingIds[exchange.exchange_id]}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else if exchange.enable}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  {/if}
                </button>
              </td>
              <td class="text-right">
                <button
                  class="btn btn-ghost btn-sm text-error hover:bg-error/10"
                  on:click={async () => {
                    if (confirm($_("confirm_delete_exchange"))) {
                      await DeleteExchange(exchange.exchange_id);
                    }
                  }}
                >
                  {#if deletingIds[exchange.exchange_id]}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  {/if}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div
      class="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-100"
    >
      <div class="text-sm text-base-content/60">
        {$_("showing")}
        <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
        {$_("to")}
        <span class="font-medium"
          >{Math.min(currentPage * itemsPerPage, exchanges.length)}</span
        >
        {$_("of")} <span class="font-medium">{exchanges.length}</span>
        {$_("exchanges")}
      </div>
      <div class="join">
        <button
          class="join-item btn btn-sm"
          disabled={currentPage === 1}
          on:click={() => (currentPage = Math.max(1, currentPage - 1))}
        >
          {$_("previous")}
        </button>
        <button
          class="join-item btn btn-sm"
          disabled={currentPage === totalPages || exchanges.length === 0}
          on:click={() => (currentPage = Math.min(totalPages, currentPage + 1))}
        >
          {$_("next")}
        </button>
      </div>
    </div>
  </div>
{/if}
