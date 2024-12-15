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
  let search = '';

  $: filteredAssets = topAssets.filter(asset => 
    asset.symbol.toLowerCase().includes(search.toLowerCase()) || 
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  onMount(async () => {
    topAssetsLoading = true;
    const result = await mixinTopAssets();
    topAssets = result;
    topAssetsLoading = false;
  });
</script>

{#if topAssetsLoading}
  <div class="flex items-center justify-center h-full">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{:else}
  <div class="flex flex-col min-h-screen bg-base-100">
    <!-- Header -->
    <div class="flex items-center gap-2 p-4 bg-white">
      <!-- Arrow left -->
      <button class="btn btn-ghost btn-circle" on:click={() => { history.back() }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <!-- Title -->
      <h1 class="text-xl font-bold">{$_("deposit")}</h1>
    </div>

    <div class="mx-8 mb-4">
      <input type="text" class="input input-bordered w-full" placeholder={$_("search")}
        bind:value={search} on:keyup={async () => { 
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
      <div class="flex flew-row flex-wrap gap-4 p-8 pt-2">
        {#each filteredAssets as asset}
            <button class="flex flex-row items-center justify-center gap-4 p-4 bg-base-100 rounded-lg shadow-md" 
              on:click={() => {
                goto(`/manage/rebalance/deposit/${asset.asset_id}`);
              }}>
              <AssetIcon assetIcon={asset.icon_url} chainIcon={findChainIcon(asset.chain_id)} clazz="size-8" />
              <div class="flex flex-col items-start justify-center">
                <span class="text-lg font-bold text-center">{asset.symbol}</span>
                <span class="text-xs text-center opacity-60">{asset.name}</span>
              </div>
            </button>
        {/each}
      </div>
    {:else}
      {#if searchingAsset}
        <div class="flex items-center justify-center my-36">
          <Loading />
        </div>
      {:else if searchAssets.length > 0}
        <div class="flex flex-wrap gap-4 p-8 pt-2">
          {#each searchAssets as asset}
              <button class="flex flex-row items-center justify-center gap-4 p-4 bg-base-100 rounded-lg shadow-md" 
                on:click={() => {
                  goto(`/manage/rebalance/deposit/${asset.asset_id}`);
                }}>
                <AssetIcon assetIcon={asset.icon_url} chainIcon={findChainIcon(asset.chain_id)} clazz="size-8" />
                <div class="flex flex-col items-start justify-center">
                  <span class="text-lg font-bold text-center">{asset.symbol}</span>
                  <span class="text-xs text-center opacity-60">{asset.name}</span>
                </div>
              </button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
{/if}