<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import {
    findCoinIconBySymbol,
  } from "$lib/helpers/helpers";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import {
    createJustGrowAsset,
    createJustGrowSearch,
  } from "$lib/stores/grow";
  import { SUPPORTED_JUST_GROW_TOKENS } from "$lib/helpers/constants";
  import { getSupportedJustGrowTokens } from "$lib/helpers/hufi/grow";

  // TODO: Replace here with API request
  const justGrowTokens = (async ()=>{return await getSupportedJustGrowTokens()})()
  $: tokens = SUPPORTED_JUST_GROW_TOKENS.map((item) => ({ ...item }))
    .filter((item) => {
        // Filter search
        return item.symbol
          .toUpperCase()
          .match($createJustGrowSearch.toUpperCase()) ||
          item.name
          .toUpperCase()
          .match($createJustGrowSearch.toUpperCase());
      })
</script>

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
      bind:value={$createJustGrowSearch}
      class={clsx(
        "input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-none border-none rounded-full join-item",
        "bg-base-200/60",
      )}
      placeholder={$_("search")}
    />
  </div>

  {#await justGrowTokens}
    <span>
      loading
    </span>
  {:then _}
    <!-- Token -->
    <div class="px-2 w-full !mt-6">
      <div class="grid grid-cols-2 gap-3 w-full overflow-y-auto">
        {#each tokens as item, i}
          <button
            class={clsx(
              "flex flex-row px-4 items-center space-x-4 justify-start shadow-none py-3 bg-base-100 border border-base-200 rounded-xl text-start",
            )}
            on:click={() => {
              createJustGrowAsset.set(item);
              goto(`/grow/just_grow/new/two/`);
            }}
            data-testid={`just-grow-token-${i}`}
          >
            <AssetIcon chainIcon="" assetIcon={findCoinIconBySymbol(item.symbol)} clazz="w-8 h-8" claxx="" imageClass="" />
            <div class="flex flex-col grow">
              <span class="text-sm font-semibold">
                {item.symbol}
              </span>
              <span class="text-xs !text-[10px] opacity-60 capitalize">
                {item.name}
              </span>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/await}
</div>
