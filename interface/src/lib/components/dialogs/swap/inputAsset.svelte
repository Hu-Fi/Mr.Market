<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    InputAsset,
    InputAssetDialog,
    InputAssetSearch,
  } from "$lib/stores/swap";
  import NoResult from "$lib/components/common/NoResult.svelte";
  import SingleSwapAsset from "$lib/components/swap/singleSwapAsset.svelte";
  import mixinChains from "$lib/constants/mixinChains.json";

  const placeholders = mixinChains;

  $: filteredAssets = placeholders.filter((item) => {
    return (
      item.symbol.toUpperCase().match($InputAssetSearch.toUpperCase()) ||
      item.name.toUpperCase().match($InputAssetSearch.toUpperCase())
    );
  });

  // TODO: Show asset with balance only

  $: $InputAssetDialog, InputAssetSearch.set("");
</script>

<dialog
  id="swap_input_asset_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$InputAssetDialog}
>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => InputAssetDialog.set(false)}></button>
  </form>
  <div class="modal-box h-[90vh] pt-0">
    <div
      class="sticky top-0 bg-opacity-100 bg-base-100 z-10 py-4 flex flex-col space-y-4"
    >
      <!-- Title -->
      <div class="flex justify-between">
        <div class="w-5" />

        <!-- Swap from -->
        <span class="font-semibold text-lg">
          {$_("swap_from")}
        </span>

        <!-- Close -->
        <button on:click={() => InputAssetDialog.set(false)}>
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            /></svg
          >
        </button>
      </div>

      <!-- Search -->
      <div class="join w-full">
        <!-- Search Icon -->
        <div class="bg-base-200 join-item flex items-center rounded-full pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            /></svg
          >
        </div>
        <input
          bind:value={$InputAssetSearch}
          class="input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-base-200 rounded-full bg-base-200 join-item"
          placeholder={$_("search")}
        />
      </div>
    </div>

    <!-- Asset list -->
    <div class="flex flex-col">
      {#if filteredAssets.length === 0}
        <NoResult />
      {:else}
        {#each filteredAssets as asset, i}
          <SingleSwapAsset
            {asset}
            fn={() => {
              InputAsset.set(asset);
              InputAssetDialog.set(false);
            }}
            testid={String(i)}
          />
        {/each}
      {/if}
    </div>
  </div>
</dialog>
