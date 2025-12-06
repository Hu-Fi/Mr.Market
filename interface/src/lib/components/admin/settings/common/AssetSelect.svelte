<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import toast from "svelte-french-toast";
  import { mixinAsset } from "$lib/helpers/mixin";
  import { MIXIN_API_BASE_URL } from "$lib/helpers/constants";

  export let label: string;
  export let value: string;
  export let placeholder: string = "";
  export let id: string;
  export let selectedAsset: any = null;

  const dispatch = createEventDispatcher();

  let isDropdownOpen = false;
  let searchResults: any[] = [];
  let isSearching = false;
  let searchTimeout: any;
  let chainAsset: any = null;
  let dropdownContainer: HTMLElement;

  $: if (selectedAsset?.chain_id) {
    mixinAsset(selectedAsset.chain_id).then((res) => {
      chainAsset = res;
    });
  } else {
    chainAsset = null;
  }

  async function searchMixinAssets(keyword: string): Promise<any[]> {
    if (!keyword) return [];
    try {
      const response = await fetch(
        `${MIXIN_API_BASE_URL}/network/assets/search/${keyword}`,
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to search Mixin assets", error);
      return [];
    }
  }

  function handleSearch(keyword: string) {
    if (searchTimeout) clearTimeout(searchTimeout);
    value = keyword;
    dispatch("input", keyword);

    if (keyword) {
      isDropdownOpen = true;
      isSearching = true;

      searchTimeout = setTimeout(async () => {
        searchResults = await searchMixinAssets(keyword);
        isSearching = false;
      }, 500);
    } else {
      isDropdownOpen = false;
      searchResults = [];
    }
  }

  function selectAsset(asset: any) {
    value = asset.asset_id;
    selectedAsset = asset;
    isDropdownOpen = false;
    dispatch("select", asset);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      isDropdownOpen &&
      dropdownContainer &&
      !dropdownContainer.contains(target)
    ) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="form-control w-full">
  <label class="label" for={id}>
    <span class="label-text font-medium">{label}</span>
  </label>
  <div
    class="dropdown w-full"
    class:dropdown-open={isDropdownOpen}
    bind:this={dropdownContainer}
  >
    <input
      {id}
      type="text"
      class="input input-bordered w-full focus:input-primary transition-all"
      bind:value
      on:input={(e) => handleSearch(e.currentTarget.value)}
      on:focus={() => {
        if (searchResults.length > 0) isDropdownOpen = true;
      }}
      {placeholder}
    />
    {#if isDropdownOpen}
      <ul
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
      >
        {#if isSearching}
          <li class="disabled">
            <span
              ><span class="loading loading-spinner loading-xs"></span>
              {$_("searching")}</span
            >
          </li>
        {:else if searchResults.length === 0}
          <li class="disabled"><span>{$_("no_assets_found")}</span></li>
        {:else}
          {#each searchResults as asset}
            <li>
              <button
                type="button"
                class="flex items-center gap-2"
                on:click={() => selectAsset(asset)}
              >
                <img
                  src={asset.icon_url}
                  alt={asset.symbol}
                  class="w-6 h-6 rounded-full"
                />
                <div class="flex flex-col items-start">
                  <span class="font-bold">{asset.symbol}</span>
                  <span class="text-xs opacity-50">{asset.name}</span>
                </div>
              </button>
            </li>
          {/each}
        {/if}
      </ul>
    {/if}
  </div>

  {#if selectedAsset}
    <div class="mt-2 p-3 bg-base-200/50 rounded-lg text-xs space-y-1">
      <div class="flex items-center gap-2">
        <span class="font-bold opacity-70">{$_("asset_name")}:</span>
        <span>{selectedAsset.name} ({selectedAsset.symbol})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-bold opacity-70">{$_("chain_id")}:</span>
        <div class="flex items-center gap-1">
          <a
            href={`https://mixin.space/asset/${selectedAsset.chain_id}`}
            target="_blank"
            class="link link-hover font-mono opacity-70"
          >
            {selectedAsset.chain_id}
          </a>
          <button
            class="btn btn-ghost btn-xs btn-square"
            on:click={() => {
              navigator.clipboard.writeText(selectedAsset.chain_id);
              toast.success($_("copied"));
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3 h-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
              />
            </svg>
          </button>
        </div>
      </div>
      {#if chainAsset}
        <div class="flex items-center gap-2">
          <span class="font-bold opacity-70">{$_("chain")}:</span>
          <div class="flex items-center gap-1">
            <img
              src={chainAsset.icon_url}
              alt={chainAsset.symbol}
              class="w-4 h-4 rounded-full"
            />
            <span>{chainAsset.name} ({chainAsset.symbol})</span>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
