<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    getAllAPIKeys,
    removeAPIKey,
  } from "$lib/helpers/hufi/admin/exchanges";
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import AddApiKey from "$lib/components/admin/exchanges/addAPIKey.svelte";
  import KeyList from "$lib/components/admin/exchanges/keyList.svelte";

  let keys: AdminSingleKey[] = [];
  $: keys = $page.data.apiKeys || [];

  let isRefreshing = false;

  async function RefreshKeys(showLoading = true) {
    if (showLoading) {
      isRefreshing = true;
      setTimeout(() => {
        invalidate("admin:settings:api-keys").finally(() => {
          isRefreshing = false;
        });
      }, getRandomDelay());
    } else {
      invalidate("admin:settings:api-keys");
    }
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
  }

  async function HandleDelete(event: CustomEvent<string>) {
    const keyId = event.detail;
    if (!keyId) return;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;

    const toastId = toast.loading($_("deleting_api_key"));

    try {
      await removeAPIKey(keyId, token);
      toast.success($_("delete_api_key_success"), { id: toastId });
      RefreshKeys(false);
    } catch (e) {
      console.error(e);
      toast.error($_("delete_api_key_failed"), { id: toastId });
    }
  }
</script>

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <button
          on:click={() => window.history.back()}
          class="btn btn-ghost btn-circle btn-sm"
        >
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <span class="text-3xl font-bold text-left">{$_("api_keys")}</span>
      </div>
      <p class="text-base-content/60">{$_("manage_exchange_api_keys")}</p>
    </div>

    <div class="flex items-center gap-3">
      <AddApiKey />

      <button class="btn btn-ghost btn-circle" on:click={() => RefreshKeys()}>
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

  {#if keys.length === 0}
    <div
      class="flex flex-col items-center justify-center p-12 text-center text-base-content/60 border border-base-200 rounded-box bg-base-100/50 dashboard-card"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-12 h-12 mb-3 opacity-20"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
        />
      </svg>

      <p class="text-lg font-medium">{$_("no_api_keys_found")}</p>
    </div>
  {:else}
    <div
      class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
    >
      <KeyList {keys} on:delete={HandleDelete} />
    </div>
  {/if}
</div>
