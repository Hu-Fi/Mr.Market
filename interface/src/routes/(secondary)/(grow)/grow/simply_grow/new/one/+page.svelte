<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    findCoinIconBySymbol,
  } from "$lib/helpers/helpers";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import {
    createSimplyGrowAsset,
    createSimplyGrowSearch,
  } from "$lib/stores/grow";
  import Loading from "$lib/components/common/loading.svelte";
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
      bind:value={$createSimplyGrowSearch}
      class={clsx(
        "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
        "bg-base-200/60",
      )}
      placeholder={$_("search")}
    />
  </div>

  {#await $page.data.growInfo}
    <div class="flex justify-center items-center w-full py-36">
      <Loading />
    </div>
  {:then growInfo}
    <!-- Token -->
    <div class="px-2 w-full !mt-6">
      <div class="grid grid-cols-2 gap-3 w-full overflow-y-auto">
        {#each growInfo.simply_grow.tokens as item, i}
          {#if item.enable && ($createSimplyGrowSearch.length === 0 || item.symbol.toUpperCase().includes($createSimplyGrowSearch.toUpperCase()) || item.name.toUpperCase().includes($createSimplyGrowSearch.toUpperCase()))}
            <button
              class={clsx(
              "flex flex-row px-4 items-center space-x-4 justify-start shadow-none py-3 bg-base-100 border border-base-200 rounded-xl text-start",
            )}
              on:click={() => {
                createSimplyGrowAsset.set(item);
                goto(`/grow/simply_grow/new/two/`);
              }}
              data-testid={`just-grow-token-${i}`}
            >
              <AssetIcon chainIcon="" assetIcon={findCoinIconBySymbol(item.symbol) || item.icon_url} clazz="w-8 h-8 min-w-8" claxx="" imageClass="" />
              <div class="flex flex-col grow truncate">
                <span class="text-sm font-semibold">
                  {item.symbol}
                </span>
                <span class="text-xs !text-[10px] opacity-60 capitalize">
                  {item.name}
                </span>
              </div>
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/await}
</div>
</div>