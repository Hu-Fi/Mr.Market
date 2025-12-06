<script lang="ts">
  import clsx from "clsx";
  import { validate } from "uuid";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import toast from "svelte-french-toast";
  import { goto } from "$app/navigation";
  import { mixinAsset } from "$lib/helpers/mixin";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { getCcxtExchangeMarkets } from "$lib/helpers/hufi/admin/growdata";

  import { MIXIN_API_BASE_URL } from "$lib/helpers/constants";
  import AssetSelect from "../common/AssetSelect.svelte";
  import type { MarketMakingPairDto } from "$lib/types/hufi/grow";
  import { addMarketMakingPair } from "$lib/helpers/hufi/admin/growdata";

  export let configuredExchanges: {
    exchange_id: string;
    name: string;
    icon_url?: string;
    enable: boolean;
  }[] = [];

  const dispatch = createEventDispatcher();

  let AddNewSymbol = "";
  let AddNewBaseSymbol = "";
  let AddNewTargetSymbol = "";
  let AddNewBaseAssetId = "";
  let AddNewBaseIconUrl = "";
  let AddNewTargetAssetId = "";
  let AddNewTargetIconUrl = "";
  let AddNewExchangeId = "";
  let AddNewCustomFeeRate = "";

  let addDialog = false;
  let isAdding = false;
  let isBaseIconFetching = false;
  let isTargetIconFetching = false;

  // Market Search State
  let isExchangeDropdownOpen = false;
  let isMarketDropdownOpen = false;
  let availableMarkets: any[] = [];
  let isLoadingMarkets = false;

  let selectedBaseAsset: any = null;
  let selectedTargetAsset: any = null;

  const cleanUpStates = () => {
    isAdding = false;
    addDialog = false;
    AddNewSymbol = "";
    AddNewBaseSymbol = "";
    AddNewTargetSymbol = "";
    AddNewBaseAssetId = "";
    AddNewBaseIconUrl = "";
    AddNewTargetAssetId = "";
    AddNewTargetIconUrl = "";
    AddNewExchangeId = "";
    AddNewCustomFeeRate = "";
    availableMarkets = [];
    availableMarkets = [];
    selectedBaseAsset = null;
    selectedTargetAsset = null;
  };

  async function AddMarketMakingPair(pair: MarketMakingPairDto) {
    if (
      !pair.symbol ||
      !pair.base_symbol ||
      !pair.target_symbol ||
      !pair.exchange_id ||
      !pair.base_asset_id ||
      !pair.target_asset_id
    ) {
      toast.error($_("fill_all_fields_msg"));
      return;
    }
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;

    toast.promise(
      addMarketMakingPair(pair, token)
        .then(() => {
          dispatch("refresh");
          cleanUpStates();
        })
        .catch((error) => {
          cleanUpStates();
          console.error(error);
          throw error;
        }),
      {
        loading: $_("adding_pair_msg"),
        success: $_("add_pair_success_msg"),
        error: $_("add_pair_failed_msg"),
      },
    );
  }

  async function fetchMarkets(exchangeId: string) {
    if (!exchangeId) return;
    isLoadingMarkets = true;
    availableMarkets = [];
    try {
      const token = localStorage.getItem("admin-access-token");
      if (token) {
        const markets = await getCcxtExchangeMarkets(exchangeId, token);
        if (Array.isArray(markets)) {
          availableMarkets = markets;
        }
      }
    } catch (e) {
      console.error("Failed to fetch markets", e);
    } finally {
      isLoadingMarkets = false;
    }
  }

  function handleMarketSelect(market: any) {
    AddNewSymbol = market.symbol;
    AddNewBaseSymbol = market.base;
    AddNewTargetSymbol = market.quote;
    isMarketDropdownOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isExchangeDropdownOpen && !target.closest(".exchange-dropdown")) {
      isExchangeDropdownOpen = false;
    }
    if (isMarketDropdownOpen && !target.closest(".market-dropdown")) {
      isMarketDropdownOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<details class="dropdown dropdown-end" bind:open={addDialog}>
  <summary
    class="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20 transition-all"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-4 h-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    {$_("add_pair")}
  </summary>
  <div
    class="dropdown-content bg-base-100 rounded-box p-6 shadow-xl border border-base-200 w-[32rem] mt-2 max-h-[80vh] overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-lg">{$_("add_new_pair")}</h3>
      <button
        class="btn btn-sm btn-circle btn-ghost"
        on:click={() => (addDialog = false)}
      >
        <!-- Close Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full col-span-2">
        <label class="label" for="exchange-id-input">
          <span class="label-text font-medium">{$_("exchange_id")}</span>
        </label>
        <div
          class="dropdown w-full exchange-dropdown"
          class:dropdown-open={isExchangeDropdownOpen}
        >
          <input
            id="exchange-id-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewExchangeId}
            on:focus={() => (isExchangeDropdownOpen = true)}
            on:input={() => (isExchangeDropdownOpen = true)}
            placeholder={$_("select_exchange_placeholder")}
          />
          {#if isExchangeDropdownOpen}
            <ul
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
            >
              {#each configuredExchanges.filter((e) => e.exchange_id
                  .toLowerCase()
                  .includes(AddNewExchangeId.toLowerCase())) as exchange}
                <li>
                  <button
                    type="button"
                    class="w-full text-left flex items-center gap-2"
                    on:click={() => {
                      AddNewExchangeId = exchange.exchange_id;
                      isExchangeDropdownOpen = false;
                      fetchMarkets(AddNewExchangeId);
                    }}
                  >
                    {#if exchange.icon_url}
                      <img
                        src={exchange.icon_url}
                        alt={exchange.name}
                        class="w-4 h-4 rounded-full"
                      />
                    {/if}
                    {exchange.name} ({exchange.exchange_id})
                  </button>
                </li>
              {/each}
              <div class="divider my-1"></div>
              <li>
                <button
                  type="button"
                  class="w-full text-left flex items-center gap-2 text-primary"
                  on:click={() => goto("/manage/settings/exchanges")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  {$_("add_new_exchange") || "+ Add New Exchange"}
                </button>
              </li>
            </ul>
          {/if}
        </div>
      </div>

      <div class="form-control w-full col-span-2">
        <label class="label" for="symbol-input">
          <span class="label-text font-medium">{$_("symbol")}</span>
          <span class="label-text-alt text-base-content/60"
            >({$_("example_pair")})</span
          >
        </label>
        <div
          class="dropdown w-full market-dropdown"
          class:dropdown-open={isMarketDropdownOpen}
        >
          <input
            id="symbol-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewSymbol}
            on:focus={() => (isMarketDropdownOpen = true)}
            on:input={() => (isMarketDropdownOpen = true)}
            placeholder={$_("search_pair_placeholder")}
            disabled={!AddNewExchangeId}
          />
          {#if isMarketDropdownOpen && AddNewExchangeId}
            <ul
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
            >
              {#if isLoadingMarkets}
                <li class="disabled">
                  <span
                    ><span class="loading loading-spinner loading-xs"></span>
                    {$_("loading_markets")}</span
                  >
                </li>
              {:else if availableMarkets.length === 0}
                <li class="disabled"><span>{$_("no_markets_found")}</span></li>
              {:else}
                {#each availableMarkets
                  .filter((m) => m.symbol
                      .toLowerCase()
                      .includes(AddNewSymbol.toLowerCase()))
                  .slice(0, 50) as market}
                  <li>
                    <button
                      type="button"
                      class="w-full text-left"
                      on:click={() => handleMarketSelect(market)}
                    >
                      {market.symbol}
                    </button>
                  </li>
                {/each}
              {/if}
            </ul>
          {/if}
        </div>
      </div>

      <div class="form-control w-full">
        <label class="label" for="base-symbol-input">
          <span class="label-text font-medium">{$_("base_symbol")}</span>
        </label>
        <input
          id="base-symbol-input"
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          bind:value={AddNewBaseSymbol}
        />
      </div>
      <div class="form-control w-full">
        <label class="label" for="target-symbol-input">
          <span class="label-text font-medium">{$_("target_symbol")}</span>
        </label>
        <input
          id="target-symbol-input"
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          bind:value={AddNewTargetSymbol}
        />
      </div>

      <div
        class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
      >
        {$_("assets")}
      </div>

      <AssetSelect
        id="base-asset-id-input"
        label={$_("base_asset_id")}
        bind:value={AddNewBaseAssetId}
        bind:selectedAsset={selectedBaseAsset}
        placeholder={$_("search_or_enter_uuid_or_symbol")}
        on:select={(e) => {
          AddNewBaseIconUrl = e.detail.icon_url;
        }}
      />

      <AssetSelect
        id="target-asset-id-input"
        label={$_("target_asset_id")}
        bind:value={AddNewTargetAssetId}
        bind:selectedAsset={selectedTargetAsset}
        placeholder={$_("search_or_enter_uuid_or_symbol")}
        on:select={(e) => {
          AddNewTargetIconUrl = e.detail.icon_url;
        }}
      />

      <div
        class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
      >
        {$_("icons")}
      </div>

      <div class="form-control w-full">
        <label class="label" for="base-icon-url-input">
          <span class="label-text font-medium">{$_("base_icon_url")}</span>
        </label>
        <div class="join w-full">
          <input
            id="base-icon-url-input"
            type="text"
            class="input input-bordered join-item w-full focus:input-primary transition-all"
            bind:value={AddNewBaseIconUrl}
          />
          {#if !AddNewBaseIconUrl && validate(AddNewBaseAssetId)}
            <button
              class="btn btn-square join-item"
              on:click={async () => {
                isBaseIconFetching = true;
                const asset = await mixinAsset(AddNewBaseAssetId);
                isBaseIconFetching = false;
                selectedBaseAsset = asset;
              }}
            >
              {#if isBaseIconFetching}
                <span class="loading loading-spinner loading-xs"></span>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                    clip-rule="evenodd"
                  />
                </svg>
              {/if}
            </button>
          {/if}
        </div>
      </div>

      <div class="form-control w-full">
        <label class="label" for="target-icon-url-input">
          <span class="label-text font-medium">{$_("target_icon_url")}</span>
        </label>
        <div class="join w-full">
          <input
            id="target-icon-url-input"
            type="text"
            class="input input-bordered join-item w-full focus:input-primary transition-all"
            bind:value={AddNewTargetIconUrl}
          />
          {#if !AddNewTargetIconUrl && validate(AddNewTargetAssetId)}
            <button
              class="btn btn-square join-item"
              on:click={async () => {
                isTargetIconFetching = true;
                const asset = await mixinAsset(AddNewTargetAssetId);
                isTargetIconFetching = false;
                selectedTargetAsset = asset;
              }}
            >
              {#if isTargetIconFetching}
                <span class="loading loading-spinner loading-xs"></span>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                    clip-rule="evenodd"
                  />
                </svg>
              {/if}
            </button>
          {/if}
        </div>
      </div>

      <div
        class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
      >
        {$_("fees")}
      </div>

      <div class="form-control w-full col-span-2">
        <label class="label" for="custom-fee-rate-input">
          <span class="label-text font-medium">{$_("custom_fee_rate")}</span>
          <span class="label-text-alt text-base-content/60"
            >{$_("optional")}</span
          >
        </label>
        <input
          id="custom-fee-rate-input"
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          bind:value={AddNewCustomFeeRate}
          placeholder="0.001"
        />
      </div>

      <div class="col-span-2 mt-4">
        <button
          class="btn btn-primary w-full"
          on:click={async () => {
            await AddMarketMakingPair({
              id: getUuid(),
              symbol: AddNewSymbol,
              base_symbol: AddNewBaseSymbol,
              target_symbol: AddNewTargetSymbol,
              base_asset_id: AddNewBaseAssetId,
              base_icon_url: AddNewBaseIconUrl,
              target_asset_id: AddNewTargetAssetId,
              target_icon_url: AddNewTargetIconUrl,
              exchange_id: AddNewExchangeId,
              custom_fee_rate: AddNewCustomFeeRate || undefined,
              enable: true,
            });
          }}
        >
          <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
            {$_("add_pair")}
          </span>
        </button>
      </div>
    </div>
  </div>
</details>
