<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import PairIcon from "$lib/components/common/tradingPairIcon.svelte";
  import {
    findCoinIconBySymbol,
    findExchangeIconByIdentifier,
  } from "$lib/helpers/helpers";
  import {
    createMMEasyPair,
    createMMSelectPairEasyFilter,
    createMMSelectPairEasySearch,
  } from "$lib/stores/grow";
  import Loading from "$lib/components/common/loading.svelte";

  $: showAllExchanges = $createMMSelectPairEasyFilter === 'all'
</script>

<div class="mx-4 mt-4 mb-24">
<div class="flex flex-col justify-start items-start space-y-4 mb-20">
  <!-- Search -->
  <div class="join w-full px-2">
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
    <input
      bind:value={$createMMSelectPairEasySearch}
      class={clsx(
        "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
        "bg-base-200/60",
      )}
      placeholder={$_("search")}
    />
  </div>

  <!-- Filter by exchanges -->
  <div class="px-2 overflow-x-auto w-full no-scrollbar">
    <div class="flex space-x-2 items-center overflow-x-auto no-scrollbar">
      <button
        on:click={() => createMMSelectPairEasyFilter.set("all")}
        class={clsx(
          "flex items-center justify-center rounded-2xl border border-base-100 space-x-1 px-4 py-1.5 no-animation font-medium shadow-none",
          $createMMSelectPairEasyFilter === "all"
            ? "bg-base-200/60"
            : "bg-base-100 border border-base-200",
        )}
      >
        <span class="font-normal text-xs"> {$_("all")} </span>
      </button>
      {#await $page.data.growInfo}
        <div />
      {:then growInfo}
        {#each growInfo.exchanges as exchange}
          <button
            on:click={() => {
              if ($createMMSelectPairEasyFilter === exchange.exchange_id) {
                createMMSelectPairEasyFilter.set('all');
                return;
              }
              createMMSelectPairEasyFilter.set(exchange.exchange_id);
            }}
            class={clsx(
              "flex items-center justify-center rounded-2xl border border-base-100 no-animation font-medium shadow-none",
              $createMMSelectPairEasyFilter === exchange.exchange_id
                ? "bg-base-200/60"
                : "bg-base-100 border border-base-200",
            )}
          >
            <div class="flex items-center justify-center mx-5 space-x-1 py-1.5">
              <img src={findExchangeIconByIdentifier(exchange.exchange_id)} alt="" class="w-4 h-4 rounded-full" />
              <span class="font-normal text-xs"> {exchange.name} </span>
            </div>
          </button>
        {/each}
      {/await}
    </div>
  </div>

  <!-- Pairs -->
  <div class="px-2 w-full !mt-6">
    {#await $page.data.growInfo}
      <div class="flex justify-center items-center w-full py-36">
        <Loading />
      </div>
    {:then growInfo}
      <div class="grid grid-cols-2 gap-4 w-full overflow-y-auto">
        {#each growInfo.market_making.pairs as item, i}
          <!-- Filter by exchange -->
          {#if showAllExchanges || item.exchange_id.toUpperCase().match($createMMSelectPairEasyFilter.toUpperCase())}
            <!-- Filter by search -->
            {#if item.enable && ($createMMSelectPairEasySearch.toUpperCase() === '' || item.symbol.toUpperCase().match($createMMSelectPairEasySearch.toUpperCase()))}
              <button
                class={clsx(
                  "flex items-center justify-center shadow-none space-x-2 py-3 bg-base-100 border border-base-200 rounded-xl text-start",
              )}
                on:click={() => {
                  createMMEasyPair.set(item);
                  goto(`/grow/market_making/new/two/`);
                }}
                data-testid={`market-making-pair-${i}`}
              >
                <PairIcon
                  clazz="w-5 h-5"
                  claxx="w-2 h-2"
                  asset0Icon={findCoinIconBySymbol(item.base_symbol)}
                  asset1Icon={findCoinIconBySymbol(item.target_symbol)}
                />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold">
                    {item.symbol}
                  </span>
                  <span class="text-xs !text-[10px] opacity-60 capitalize">
                    {item.exchange_id}
                  </span>
                </div>
              </button>
            {/if}
          {/if}
        {/each}
      </div>
    {/await}
  </div>
</div>
</div>