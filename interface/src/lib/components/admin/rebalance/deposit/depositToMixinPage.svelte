<script>
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { findChainIcon } from "$lib/helpers/utils";
  import Loading from "$lib/components/common/loading.svelte";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { mixinAssetSearch, mixinTopAssets } from "$lib/helpers/mixin";

  let topAssets = [];
  let topAssetsLoading = false;
  let searchingAsset = false;
  let searchAssets = [];
  let search = "";

  $: filteredAssets = topAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase()),
  );

  onMount(async () => {
    topAssetsLoading = true;
    const result = await mixinTopAssets();
    topAssets = result;
    topAssetsLoading = false;
  });
</script>

{#if topAssetsLoading}
  <div class="flex items-center justify-center h-[calc(100vh-100px)]">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{:else}
  <div class="mx-8 mb-4">
    <input
      type="text"
      class="input input-bordered w-full focus:outline-none rounded-lg"
      placeholder={$_("search")}
      bind:value={search}
      on:keyup={async () => {
        if (filteredAssets.length === 0) {
          searchingAsset = true;
          const result = await mixinAssetSearch(search);
          searchAssets = result;
          searchingAsset = false;
        }
      }}
    />
  </div>

  {#if filteredAssets.length > 0}
    <div class="flex flew-row flex-wrap gap-5 p-8 pt-2">
      {#each filteredAssets as asset}
        <button
          class="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-base-100 rounded-full shadow-md"
          on:click={() => {
            goto(`/manage/rebalance/deposit/mixin/${asset.asset_id}`);
          }}
        >
          <AssetIcon
            assetIcon={asset.icon_url}
            chainIcon={findChainIcon(asset.chain_id)}
            clazz="size-8"
          />
          <div class="flex flex-col items-start justify-center">
            <span class="text-base font-bold text-center">{asset.symbol}</span>
            <span class="text-xs text-center opacity-60">{asset.name}</span>
          </div>
        </button>
      {/each}
    </div>
  {:else if searchingAsset}
    <div class="flex items-center justify-center my-36">
      <Loading />
    </div>
  {:else if searchAssets.length > 0}
    <div class="flex flew-row flex-wrap gap-5 p-8 pt-2">
      {#each searchAssets as asset}
        <button
          class="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-base-100 rounded-full shadow-md"
          on:click={() => {
            goto(`/manage/rebalance/deposit/mixin/${asset.asset_id}`);
          }}
        >
          <AssetIcon
            assetIcon={asset.icon_url}
            chainIcon={findChainIcon(asset.chain_id)}
            clazz="size-8"
          />
          <div class="flex flex-col items-start justify-center">
            <span class="text-base font-bold text-center">{asset.symbol}</span>
            <span class="text-xs text-center opacity-60">{asset.name}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
{/if}
