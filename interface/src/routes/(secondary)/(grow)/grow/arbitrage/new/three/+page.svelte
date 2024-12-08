<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import PairIcon from "$lib/components/common/pairIcon.svelte";
  import { createArbPair, createArbPairSearch } from "$lib/stores/grow";
</script>

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
      <input
        bind:value={$createArbPairSearch}
        class={clsx(
          "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
          "bg-base-200/60",
        )}
        placeholder={$_("search")}
      />
    </div>

    {#await $page.data.growInfo}
      <div class="flex justify-center items-center w-full">
        <span class="text-sm loading loading-spinner loading-md" />
      </div>
    {:then growInfo}
      <!-- Pairs -->
      <div class="grid grid-cols-1 gap-2 w-full overflow-y-auto">
        {#each growInfo.arbitrage.pairs as item, i}
          {#if item.enable && ($createArbPairSearch.length === 0 || item.symbol.toUpperCase().includes($createArbPairSearch.toUpperCase()))}
            <button
              class={clsx(
                "flex items-center justify-start px-4 shadow-none space-x-4 py-3 bg-base-100 border border-base-200 rounded-xl text-start",
                "",
              )}
              on:click={() => {
                createArbPair.set(item);
                goto(`/grow/arbitrage/new/four`);
              }}
              data-testid={`arbitrage-pair-${i}`}
            >
              <PairIcon
                clazz="w-5 h-5"
                claxx="w-2 h-2"
                asset0Icon={findCoinIconBySymbol(item.symbol.split("/")[0] || '')}
                asset1Icon={findCoinIconBySymbol(item.symbol.split("/")[1] || '')}
              />
              <div class="flex flex-col my-2">
                <span class="text-sm font-semibold">
                  {item.symbol}
                </span>
              </div>
            </button>
          {/if}
        {/each}
      </div>
    {/await}  
  </div>
</div>