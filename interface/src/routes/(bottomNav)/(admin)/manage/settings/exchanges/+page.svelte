<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import {
    getSupportedExchanges,
    updateExchange,
  } from "$lib/helpers/hufi/admin/growdata";
  import {
    addExchange,
    removeExchange,
  } from "$lib/helpers/hufi/admin/growdata";

  $: supportedExchanges = [] as string[];
  $: exchanges = $page.data.growInfo.exchanges as {
    exchange_id: string;
    name: string;
    icon_url?: string;
    enable: boolean;
  }[];

  let AddNewName = "";
  let AddNewExchangeId = "";
  let AddNewIconUrl = "";

  let addDialog = false;
  let isAdding = false;
  let isUpdating = "";
  let isRefreshing = false;
  let isDeleting = "";

  async function AddExchange(
    name: string,
    exchangeId: string,
    iconUrl: string,
  ) {
    if (!name || !exchangeId) return;
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await addExchange(
      { name, exchange_id: exchangeId, icon_url: iconUrl },
      token,
    );
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isAdding = false;
        addDialog = false;
        AddNewName = "";
        AddNewExchangeId = "";
        AddNewIconUrl = "";
      });
    }, getRandomDelay());
  }

  async function UpdateExchange(
    exchange_id: string,
    name: string,
    enable: boolean,
    iconUrl: string,
  ) {
    if (!exchange_id) return;
    isUpdating = exchange_id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await updateExchange(
      exchange_id,
      { exchange_id, name, enable, icon_url: iconUrl },
      token,
    );
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isUpdating = "";
      });
    }, getRandomDelay());
  }

  async function DeleteExchange(exchange_id: string) {
    if (!exchange_id) return;
    isDeleting = exchange_id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await removeExchange(exchange_id, token);
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isDeleting = "";
      });
    }, getRandomDelay());
  }

  async function RefreshExchanges() {
    isRefreshing = true;
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isRefreshing = false;
        isUpdating = "";
        isDeleting = "";
        isAdding = false;
      });
    }, getRandomDelay());
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
  }

  onMount(async () => {
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    supportedExchanges = (await getSupportedExchanges(token)) as string[];
  });
</script>

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">{$_("exchanges")}</h1>
      <p class="text-base-content/60">{$_("manage_connected_exchanges")}</p>
    </div>

    <div class="flex items-center gap-3">
      <details class="dropdown dropdown-end" bind:open={addDialog}>
        <summary
          class="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {$_("add_exchange")}
        </summary>
        <div
          class="menu dropdown-content bg-base-100 rounded-box z-[1] p-6 shadow-xl border border-base-200 w-96 mt-2"
        >
          <h3 class="font-bold text-lg mb-4">{$_("add_new_exchange")}</h3>
          <div class="flex flex-col gap-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-medium">{$_("display_name")}</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full focus:input-primary transition-all"
                placeholder={$_("placeholder_exchange_name")}
                bind:value={AddNewName}
              />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-medium">{$_("exchange_id")}</span>
                <span class="label-text-alt text-base-content/60">ccxt id</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full focus:input-primary transition-all"
                placeholder={$_("placeholder_exchange_id")}
                bind:value={AddNewExchangeId}
              />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-medium">{$_("icon_url")}</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full focus:input-primary transition-all"
                placeholder={$_("placeholder_url")}
                bind:value={AddNewIconUrl}
              />
            </div>
            <button
              class="btn btn-primary w-full mt-2"
              on:click={async () => {
                await AddExchange(AddNewName, AddNewExchangeId, AddNewIconUrl);
              }}
            >
              <span
                class={clsx(isAdding && "loading loading-spinner loading-sm")}
              >
                {$_("add_exchange")}
              </span>
            </button>
          </div>
        </div>
      </details>

      <button
        class="btn btn-ghost btn-circle"
        on:click={() => RefreshExchanges()}
      >
        <span
          class={clsx(isRefreshing && "loading loading-spinner loading-sm")}
        >
          {#if !isRefreshing}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          {/if}
        </span>
      </button>
    </div>
  </div>

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
              <th class="w-16">{$_("icon")}</th>
              <th>{$_("display_name")}</th>
              <th>{$_("exchange_id")}</th>
              <th class="text-center">{$_("supported")}</th>
              <th class="text-center">{$_("status")}</th>
              <th class="text-right">{$_("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {#if exchanges.length === 0}
              <tr>
                <td colspan="6" class="text-center py-12 text-base-content/40">
                  {$_("no_exchanges_found")}
                </td>
              </tr>
            {/if}

            {#each exchanges as exchange}
              <tr class="hover:bg-base-200/30 transition-colors">
                <td>
                  {#if exchange.icon_url}
                    <div class="avatar">
                      <div class="w-10 h-10 rounded-xl bg-base-200 p-1">
                        <img src={exchange.icon_url} alt={exchange.name} />
                      </div>
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
                    <div class="badge badge-success badge-sm gap-1">
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
                    <div class="badge badge-error badge-outline badge-sm">
                      {$_("unsupported")}
                    </div>
                  {/if}
                </td>
                <td class="text-center">
                  <button
                    class={clsx(
                      "btn btn-sm btn-circle transition-all",
                      exchange.enable
                        ? "btn-success text-white"
                        : "btn-ghost text-base-content/40",
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
                    disabled={!!isUpdating}
                  >
                    {#if isUpdating === exchange.exchange_id}
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
                    {#if isDeleting === exchange.exchange_id}
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
    </div>
  {/if}
</div>
