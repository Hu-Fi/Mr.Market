<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import {
    findChainIcon,
    itemInArray,
    toggleItemInArray,
  } from "$lib/helpers/utils";
  import mixinChains from "$lib/constants/mixinChains.json";
  import {
    createNewAutoInvestAssets,
    selectAssetSearch,
  } from "$lib/stores/grow";
  import AssetIcon from "$lib/components/wallet/asset/assetIcon.svelte";

  let assets = mixinChains.map(item => ({ ...item, selected: false }))
  $: placeholders =  $selectAssetSearch ? 
    assets.filter((item) => {
      return (
        item.name.toUpperCase().match($selectAssetSearch.toUpperCase()) ||
        item.symbol.toUpperCase().match($selectAssetSearch.toUpperCase())
      );
  }) : assets;

  const toggleHighlight = async (item: object, index: number) => {
    toggleItemInArray($createNewAutoInvestAssets, "chain_id", item);
  };
</script>

<div class="flex flex-col justify-start items-start space-y-4 mb-20">
  <!-- Search -->
  <div class="join w-full px-1">
    <!-- Search Icon -->
    <div class="bg-base-200 join-item flex items-center rounded-full pl-3">
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
      bind:value={$selectAssetSearch}
      class="input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-0 rounded-full bg-base-200 join-item"
      placeholder={$_("search")}
    />
  </div>

  <!-- Pairs -->
  <div class="flex flex-wrap !mt-4 overflow-y-auto">
    {#each placeholders as item, i}
      <button
        class={clsx(
          "flex just items-center justify-center space-x-1 mx-1 my-2 p-2 border shadow-sm rounded-xl text-start",
          itemInArray($createNewAutoInvestAssets, 'chain_id', item) ? 'bg-slate-50 border-primary' : 'bg-base-100'
        )}
        on:click={() => {
          toggleHighlight(item, i);
          item.selected = !item.selected
        }}
      >
        <AssetIcon
          assetIcon={item.icon_url}
          chainIcon={findChainIcon(item.chain_id)}
          clazz="w-5 h-5"
          claxx="w-2 h-2"
        />
        <span class="text-xs font-semibold">
          {item.symbol}
        </span>
      </button>
    {/each}
  </div>
</div>
