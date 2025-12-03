<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import {
    getSupportedExchanges,
    getAllCcxtExchanges,
  } from "$lib/helpers/hufi/admin/growdata";
  import AddExchange from "$lib/components/admin/exchanges/addExchange.svelte";
  import ExchangeList from "$lib/components/admin/exchanges/exchangeList.svelte";

  $: supportedExchanges = [] as string[];
  $: allCcxtExchanges = [] as string[];
  $: exchanges = $page.data.growInfo.exchanges as {
    exchange_id: string;
    name: string;
    icon_url?: string;
    enable: boolean;
  }[];

  let isRefreshing = false;

  async function RefreshExchanges() {
    isRefreshing = true;
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isRefreshing = false;
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
    allCcxtExchanges = await getAllCcxtExchanges(token);
  });
</script>

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    <div class="space-y-1">
      <span class="text-3xl font-bold text-left">{$_("exchanges")}</span>
      <p class="text-base-content/60">{$_("manage_connected_exchanges")}</p>
    </div>

    <div class="flex items-center gap-3">
      <AddExchange {allCcxtExchanges} />

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

  <ExchangeList {exchanges} {supportedExchanges} />
</div>
