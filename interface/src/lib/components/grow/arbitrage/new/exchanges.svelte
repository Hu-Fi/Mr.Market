<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import {
    createArbAmount,
    createArbConfirmDialog,
    createArbExchange1,
    createArbExchange1Search,
    createArbExchange2Search,
    createArbPair,
    editArbitrageDialog,
  } from "$lib/stores/grow";
  import { page } from "$app/stores";
  import ExchangeBtn from "$lib/components/grow/arbitrage/new/exchangeBtn.svelte";
    import Loading from "$lib/components/common/loading.svelte";

  onDestroy(() => {
    createArbPair.set("");
    createArbAmount.set([]);
    createArbExchange1Search.set("");
    createArbExchange2Search.set("");
    createArbConfirmDialog.set(false);
    editArbitrageDialog.set(false);
  });

  export let typeIndex: 1 | 2 = 1;
</script>

{#await $page.data.growInfo}
  <div class="flex justify-center items-center w-full py-36">
    <Loading />
  </div>
{:then growInfo}
  <div class="grid w-full px-4 mt-4">
    <div class="flex flex-col space-y-6 mb-20 px-2">
      <!-- Search -->
      <div class="join w-full">
        <!-- Search Icon -->
        <div
          class={clsx(
            "join-item flex items-center rounded-full pl-3",
            "bg-slate-100",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            /></svg
          >
        </div>
        {#if typeIndex === 1}
          <input
            bind:value={$createArbExchange1Search}
            class={clsx(
              "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
              "bg-base-200/60",
            )}
            placeholder={$_("search")}
          />
        {:else if typeIndex === 2}
          <input
            bind:value={$createArbExchange2Search}
            class={clsx(
              "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
              "bg-base-200/60",
            )}
            placeholder={$_("search")}
          />
        {/if}
      </div>
      <div class="grid grid-cols-2 gap-4 select-text">
        {#if typeIndex === 1}
          {#each growInfo.data.exchanges as exchange, i}
            {#if ($createArbExchange1Search.length === 0 || exchange.exchange_id.toUpperCase().includes($createArbExchange1Search.toUpperCase()))}
              <ExchangeBtn typeIndex={1} exchangeName={exchange.exchange_id} i={i} />
            {/if}
          {/each}
        {:else if typeIndex === 2}
          {#each growInfo.data.exchanges as exchange, i}
            {#if (exchange.exchange_id !== $createArbExchange1) && ($createArbExchange2Search.length === 0 || exchange.exchange_id.toUpperCase().includes($createArbExchange2Search.toUpperCase()))}
              <ExchangeBtn typeIndex={2} exchangeName={exchange.exchange_id} i={i} />
            {/if}
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/await}
