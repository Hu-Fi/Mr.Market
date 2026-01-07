<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import toast from "svelte-french-toast";
  import { invalidate } from "$app/navigation";
  import { getRandomDelay } from "$lib/helpers/utils";
  import type { SpotTradingPair } from "$lib/types/hufi/spot";
  import {
    updateSpotTradingPair,
    removeSpotTradingPair,
  } from "$lib/helpers/mrm/admin/spotdata";

  export let tradingPairs: SpotTradingPair[] = [];

  let isUpdating = "";
  let isDeleting = "";

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;
  $: totalPages = Math.ceil(tradingPairs.length / itemsPerPage);
  $: paginatedPairs = tradingPairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  $: startIndex = (currentPage - 1) * itemsPerPage + 1;
  $: endIndex = Math.min(currentPage * itemsPerPage, tradingPairs.length);

  async function UpdateSpotTradingPair(id: string, enable: boolean) {
    if (!id) return;
    isUpdating = id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await updateSpotTradingPair(id, { enable }, token).catch((error) => {
      console.error(error);
    });

    setTimeout(() => {
      invalidate("admin:settings:spot-trading").finally(() => {
        isUpdating = "";
      });
    }, getRandomDelay());
  }

  async function DeleteSpotTradingPair(id: string) {
    if (!id) return;
    isDeleting = id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await removeSpotTradingPair(id, token);
    setTimeout(() => {
      invalidate("admin:settings:spot-trading").finally(() => {
        isDeleting = "";
      });
    }, getRandomDelay());
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success($_("copied"));
  }
</script>

<div class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
  <div class="overflow-x-auto">
    <table class="table table-lg">
      <thead class="bg-base-200/50 text-base-content/70">
        <tr>
          <th class="uppercase text-xs font-semibold">{$_("symbol")}</th>
          <th class="uppercase text-xs font-semibold">{$_("exchange_id")}</th>
          <th class="uppercase text-xs font-semibold">{$_("ccxt_id")}</th>
          <th class="uppercase text-xs font-semibold">{$_("base_asset_id")}</th>
          <th class="uppercase text-xs font-semibold">{$_("quote_asset_id")}</th
          >
          <th class="uppercase text-xs font-semibold"
            >{$_("custom_fee_rate")}</th
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
        {#if paginatedPairs.length === 0}
          <tr>
            <td colspan="8" class="text-center py-12 text-base-content/40">
              {$_("no_pairs_found")}
            </td>
          </tr>
        {/if}

        {#each paginatedPairs as pair}
          <tr class="hover:bg-base-200/30 transition-colors">
            <td class="font-medium"
              ><span class="badge badge-ghost font-mono">{pair.symbol}</span
              ></td
            >
            <td>{pair.exchange_id}</td>
            <td class="text-xs font-mono opacity-70">{pair.ccxt_id}</td>
            <td class="max-w-[150px]">
              <div class="flex items-center gap-1 group/id">
                <span
                  class="truncate text-xs opacity-50 font-mono"
                  title={pair.base_asset_id}
                >
                  {pair.base_asset_id.slice(0, 8)}...{pair.base_asset_id.slice(
                    -4,
                  )}
                </span>
                <button
                  class="btn btn-ghost btn-xs btn-square opacity-0 group-hover/id:opacity-100 transition-opacity"
                  on:click={() => copyToClipboard(pair.base_asset_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
                    />
                  </svg>
                </button>
              </div>
            </td>
            <td class="max-w-[150px]">
              <div class="flex items-center gap-1 group/id">
                <span
                  class="truncate text-xs opacity-50 font-mono"
                  title={pair.quote_asset_id}
                >
                  {pair.quote_asset_id.slice(
                    0,
                    8,
                  )}...{pair.quote_asset_id.slice(-4)}
                </span>
                <button
                  class="btn btn-ghost btn-xs btn-square opacity-0 group-hover/id:opacity-100 transition-opacity"
                  on:click={() => copyToClipboard(pair.quote_asset_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3 h-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
                    />
                  </svg>
                </button>
              </div>
            </td>
            <td>
              {#if pair.custom_fee_rate}
                <span class="badge badge-primary badge-outline badge-sm"
                  >{pair.custom_fee_rate}</span
                >
              {:else}
                <span class="text-base-content/30">-</span>
              {/if}
            </td>
            <td class="text-center">
              <button
                class={clsx(
                  "btn btn-sm btn-circle transition-all",
                  pair.enable
                    ? "btn-success text-white"
                    : "btn-ghost text-base-content/40",
                )}
                on:click={async () => {
                  const newEnable = !pair.enable;
                  await UpdateSpotTradingPair(pair.id, newEnable);
                }}
                disabled={!!isUpdating}
              >
                {#if isUpdating === pair.id}
                  <span class="loading loading-spinner loading-xs"></span>
                {:else if pair.enable}
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
                  if (confirm($_("confirm_delete_pair"))) {
                    await DeleteSpotTradingPair(pair.id);
                  }
                }}
              >
                {#if isDeleting === pair.id}
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
      {startIndex}-{endIndex}
      {$_("of")}
      {tradingPairs.length}
      {$_("entries")}
    </div>
    <div class="flex items-center gap-2">
      <button
        class="btn btn-ghost btn-sm btn-square"
        disabled={currentPage === 1}
        on:click={() => (currentPage = Math.max(1, currentPage - 1))}
      >
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
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        class="btn btn-ghost btn-sm btn-square"
        disabled={currentPage === totalPages || tradingPairs.length === 0}
        on:click={() => (currentPage = Math.min(totalPages, currentPage + 1))}
      >
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
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
