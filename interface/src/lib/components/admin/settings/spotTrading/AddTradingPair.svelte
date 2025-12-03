<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { invalidate } from "$app/navigation";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { getRandomDelay } from "$lib/helpers/utils";
  import type { SpotTradingPair } from "$lib/types/hufi/spot";
  import { addSpotTradingPair } from "$lib/helpers/hufi/admin/spotdata";
  import { getCcxtExchangeMarkets } from "$lib/helpers/hufi/admin/growdata";
  import { MIXIN_API_BASE_URL } from "$lib/helpers/constants";

  import toast from "svelte-french-toast";

  export let configuredExchanges: {
    exchange_id: string;
    name: string;
    icon_url?: string;
    enable: boolean;
  }[] = [];

  let AddNewSymbol = "";
  let AddNewExchangeId = "";
  let AddNewCcxtId = "";
  let AddNewAmountSignificantFigures = "";
  let AddNewPriceSignificantFigures = "";
  let AddNewBuyDecimalDigits = "";
  let AddNewSellDecimalDigits = "";
  let AddNewMaxBuyAmount = "";
  let AddNewMaxSellAmount = "";
  let AddNewBaseAssetId = "";
  let AddNewQuoteAssetId = "";
  let AddNewCustomFeeRate = "";

  let addDialog = false;
  let isAdding = false;
  let isExchangeDropdownOpen = false;
  let isMarketDropdownOpen = false;
  let availableMarkets: any[] = [];
  let isLoadingMarkets = false;

  const cleanUpStates = () => {
    isAdding = false;
    addDialog = false;
    AddNewSymbol = "";
    AddNewExchangeId = "";
    AddNewCcxtId = "";
    AddNewAmountSignificantFigures = "";
    AddNewPriceSignificantFigures = "";
    AddNewBuyDecimalDigits = "";
    AddNewSellDecimalDigits = "";
    AddNewMaxBuyAmount = "";
    AddNewMaxSellAmount = "";
    AddNewBaseAssetId = "";
    AddNewQuoteAssetId = "";
    AddNewCustomFeeRate = "";
    availableMarkets = [];
  };

  async function AddSpotTradingPair(pair: SpotTradingPair) {
    if (
      !pair.symbol ||
      !pair.exchange_id ||
      !pair.ccxt_id ||
      !pair.base_asset_id ||
      !pair.quote_asset_id
    ) {
      toast.error(
        $_("fill_all_fields_msg") || "Please fill all required fields",
      );
      return;
    }
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    toast.promise(
      addSpotTradingPair(pair, token)
        .then(() => {
          setTimeout(() => {
            invalidate("admin:settings:spot-trading").finally(() => {
              cleanUpStates();
            });
          }, getRandomDelay());
        })
        .catch((error) => {
          cleanUpStates();
          console.error(error);
          throw error;
        }),
      {
        loading: $_("adding_pair_msg") || "Adding trading pair...",
        success:
          $_("add_pair_success_msg") || "Trading pair added successfully!",
        error: (err) =>
          `${$_("add_pair_failed_msg") || "Failed to add trading pair"}: ${err.message || err}`,
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
    AddNewCcxtId = market.id;
    // AddNewBaseAssetId = market.baseId || market.base; // User requested to not fill this
    // AddNewQuoteAssetId = market.quoteId || market.quote; // User requested to not fill this

    // Auto-fill precision if available
    if (market.precision) {
      if (market.precision.amount) {
        AddNewAmountSignificantFigures = market.precision.amount.toString();
        AddNewSellDecimalDigits = market.precision.amount.toString();
      }
      if (market.precision.price) {
        AddNewPriceSignificantFigures = market.precision.price.toString();
        AddNewBuyDecimalDigits = market.precision.price.toString();
      }
    }

    // Auto-fill limits if available (limits might be nested differently depending on CCXT structure)
    // This is a best-effort mapping
    if (market.limits) {
      if (market.limits.amount && market.limits.amount.max)
        AddNewMaxBuyAmount = market.limits.amount.max.toString();
      // Assuming sell limit is same as buy limit for simplicity if not explicitly separate
      if (market.limits.amount && market.limits.amount.max)
        AddNewMaxSellAmount = market.limits.amount.max.toString();
    }

    isMarketDropdownOpen = false;
  }

  // Asset Search Logic
  let isBaseAssetDropdownOpen = false;
  let isQuoteAssetDropdownOpen = false;
  let baseAssetSearchResults: any[] = [];
  let quoteAssetSearchResults: any[] = [];
  let isSearchingBaseAsset = false;
  let isSearchingQuoteAsset = false;
  let searchTimeout: any;

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

  function handleAssetSearch(keyword: string, type: "base" | "quote") {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (type === "base") {
      isBaseAssetDropdownOpen = true;
      isSearchingBaseAsset = true;
    } else {
      isQuoteAssetDropdownOpen = true;
      isSearchingQuoteAsset = true;
    }

    searchTimeout = setTimeout(async () => {
      const results = await searchMixinAssets(keyword);
      if (type === "base") {
        baseAssetSearchResults = results;
        isSearchingBaseAsset = false;
      } else {
        quoteAssetSearchResults = results;
        isSearchingQuoteAsset = false;
      }
    }, 500);
  }

  function selectAsset(asset: any, type: "base" | "quote") {
    if (type === "base") {
      AddNewBaseAssetId = asset.asset_id;
      isBaseAssetDropdownOpen = false;
    } else {
      AddNewQuoteAssetId = asset.asset_id;
      isQuoteAssetDropdownOpen = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isExchangeDropdownOpen && !target.closest(".exchange-dropdown")) {
      isExchangeDropdownOpen = false;
    }
    if (isMarketDropdownOpen && !target.closest(".market-dropdown")) {
      isMarketDropdownOpen = false;
    }
    if (
      isBaseAssetDropdownOpen &&
      !target.closest("#base-asset-id-input") &&
      !target.closest(".dropdown-content")
    ) {
      isBaseAssetDropdownOpen = false;
    }
    if (
      isQuoteAssetDropdownOpen &&
      !target.closest("#quote-asset-id-input") &&
      !target.closest(".dropdown-content")
    ) {
      isQuoteAssetDropdownOpen = false;
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
    class=" dropdown-content bg-base-100 rounded-box p-6 shadow-xl border border-base-200 w-[32rem] mt-2 max-h-[80vh] overflow-y-auto"
  >
    <div class="mb-4">
      <span class="font-bold text-lg">{$_("add_new_pair")}</span>
    </div>

    {#if configuredExchanges.length === 0}
      <div class="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <span
          >{$_("no_exchanges_configured_msg") ||
            "No exchanges configured. Please go to Settings > Exchanges to add one."}</span
        >
        <div>
          <a href="/manage/settings/exchanges" class="btn btn-sm"
            >{$_("go_to_exchanges")}</a
          >
        </div>
      </div>
    {:else}
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
              placeholder="Select an exchange"
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
              placeholder="Search for a pair (e.g. BTC/USDT)"
              disabled={!AddNewExchangeId}
            />
            {#if isMarketDropdownOpen && AddNewExchangeId}
              <ul
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
              >
                {#if isLoadingMarkets}
                  <li class="disabled">
                    <span
                      ><span class="loading loading-spinner loading-xs"></span> Loading
                      markets...</span
                    >
                  </li>
                {:else if availableMarkets.length === 0}
                  <li class="disabled"><span>No markets found</span></li>
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
          <label class="label" for="ccxt-id-input">
            <span class="label-text font-medium">{$_("ccxt_id")}</span>
          </label>
          <input
            id="ccxt-id-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewCcxtId}
          />
        </div>

        <div
          class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
        >
          {$_("assets")}
        </div>

        <div class="form-control w-full">
          <label class="label" for="base-asset-id-input">
            <span class="label-text font-medium">{$_("base_asset_id")}</span>
          </label>
          <div
            class="dropdown w-full"
            class:dropdown-open={isBaseAssetDropdownOpen}
          >
            <input
              id="base-asset-id-input"
              type="text"
              class="input input-bordered w-full focus:input-primary transition-all"
              bind:value={AddNewBaseAssetId}
              on:input={(e) => handleAssetSearch(e.currentTarget.value, "base")}
              on:focus={() => {
                if (baseAssetSearchResults.length > 0)
                  isBaseAssetDropdownOpen = true;
              }}
              placeholder="Search or enter UUID"
            />
            {#if isBaseAssetDropdownOpen}
              <ul
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
              >
                {#if isSearchingBaseAsset}
                  <li class="disabled">
                    <span
                      ><span class="loading loading-spinner loading-xs"></span> Searching...</span
                    >
                  </li>
                {:else if baseAssetSearchResults.length === 0}
                  <li class="disabled"><span>No assets found</span></li>
                {:else}
                  {#each baseAssetSearchResults as asset}
                    <li>
                      <button
                        type="button"
                        class="flex items-center gap-2"
                        on:click={() => selectAsset(asset, "base")}
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
        </div>
        <div class="form-control w-full">
          <label class="label" for="quote-asset-id-input">
            <span class="label-text font-medium">{$_("quote_asset_id")}</span>
          </label>
          <div
            class="dropdown w-full"
            class:dropdown-open={isQuoteAssetDropdownOpen}
          >
            <input
              id="quote-asset-id-input"
              type="text"
              class="input input-bordered w-full focus:input-primary transition-all"
              bind:value={AddNewQuoteAssetId}
              on:input={(e) =>
                handleAssetSearch(e.currentTarget.value, "quote")}
              on:focus={() => {
                if (quoteAssetSearchResults.length > 0)
                  isQuoteAssetDropdownOpen = true;
              }}
              placeholder="Search or enter UUID"
            />
            {#if isQuoteAssetDropdownOpen}
              <ul
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
              >
                {#if isSearchingQuoteAsset}
                  <li class="disabled">
                    <span
                      ><span class="loading loading-spinner loading-xs"></span> Searching...</span
                    >
                  </li>
                {:else if quoteAssetSearchResults.length === 0}
                  <li class="disabled"><span>No assets found</span></li>
                {:else}
                  {#each quoteAssetSearchResults as asset}
                    <li>
                      <button
                        type="button"
                        class="flex items-center gap-2"
                        on:click={() => selectAsset(asset, "quote")}
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
        </div>

        <div
          class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
        >
          {$_("precision")}
        </div>

        <div class="form-control w-full">
          <label class="label" for="amount-sig-figs-input">
            <span class="label-text font-medium">{$_("amount_sig_figs")}</span>
          </label>
          <input
            id="amount-sig-figs-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewAmountSignificantFigures}
          />
        </div>
        <div class="form-control w-full">
          <label class="label" for="price-sig-figs-input">
            <span class="label-text font-medium">{$_("price_sig_figs")}</span>
          </label>
          <input
            id="price-sig-figs-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewPriceSignificantFigures}
          />
        </div>
        <div class="form-control w-full">
          <label class="label" for="buy-decimals-input">
            <span class="label-text font-medium">{$_("buy_decimals")}</span>
          </label>
          <input
            id="buy-decimals-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewBuyDecimalDigits}
          />
        </div>
        <div class="form-control w-full">
          <label class="label" for="sell-decimals-input">
            <span class="label-text font-medium">{$_("sell_decimals")}</span>
          </label>
          <input
            id="sell-decimals-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewSellDecimalDigits}
          />
        </div>

        <div
          class="divider col-span-2 text-xs font-bold opacity-50 uppercase tracking-widest"
        >
          {$_("limits")}
        </div>

        <div class="form-control w-full">
          <label class="label" for="max-buy-amount-input">
            <span class="label-text font-medium">{$_("max_buy_amount")}</span>
          </label>
          <input
            id="max-buy-amount-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewMaxBuyAmount}
          />
        </div>
        <div class="form-control w-full">
          <label class="label" for="max-sell-amount-input">
            <span class="label-text font-medium">{$_("max_sell_amount")}</span>
          </label>
          <input
            id="max-sell-amount-input"
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            bind:value={AddNewMaxSellAmount}
          />
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
              await AddSpotTradingPair({
                symbol: AddNewSymbol,
                exchange_id: AddNewExchangeId,
                ccxt_id: AddNewCcxtId,
                amount_significant_figures: AddNewAmountSignificantFigures,
                price_significant_figures: AddNewPriceSignificantFigures,
                buy_decimal_digits: AddNewBuyDecimalDigits,
                sell_decimal_digits: AddNewSellDecimalDigits,
                max_buy_amount: AddNewMaxBuyAmount,
                max_sell_amount: AddNewMaxSellAmount,
                base_asset_id: AddNewBaseAssetId,
                quote_asset_id: AddNewQuoteAssetId,
                custom_fee_rate: AddNewCustomFeeRate || undefined,
                enable: true,
                id: getUuid(),
              });
              addDialog = false;
            }}
          >
            <span
              class={clsx(isAdding && "loading loading-spinner loading-sm")}
            >
              {$_("add_pair")}
            </span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</details>
