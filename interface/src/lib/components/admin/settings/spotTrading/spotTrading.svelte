<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { getRandomDelay } from "$lib/helpers/utils";
  import type { SpotTradingPair } from "$lib/types/hufi/spot";
  import { addSpotTradingPair, updateSpotTradingPair, removeSpotTradingPair } from "$lib/helpers/hufi/admin/spotdata";

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

  let addDialog = false;
  let isAdding = false;
  let isUpdating = '';
  let isDeleting = '';
  let isRefreshing = false;

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
  }

  async function AddSpotTradingPair(pair: SpotTradingPair) {
    if (!pair.symbol || !pair.exchange_id || !pair.ccxt_id || !pair.base_asset_id || !pair.quote_asset_id) return;
    isAdding = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    addSpotTradingPair(pair, token).then(() => {
      setTimeout(() => {
        invalidate('admin:settings').finally(() => {
          cleanUpStates();
        });
      }, getRandomDelay());
    }).catch((error) => {
      cleanUpStates();
      console.error(error);
    });
  }

  async function UpdateSpotTradingPair(id: string, enable: boolean) {
    if (!id) return;
    isUpdating = id;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    await updateSpotTradingPair(id, {enable}, token).catch((error) => {
      console.error(error);
    });
    
    setTimeout(async () => {
      await invalidate('admin:settings').finally(() => {
        isUpdating = '';
      });
    }, getRandomDelay());
  }

  async function DeleteSpotTradingPair(id: string) {
    if (!id) return;
    isDeleting = id;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    await removeSpotTradingPair(id, token);
    setTimeout(() => {
      invalidate('admin:settings').finally(() => {
        isDeleting = '';
      });
    }, getRandomDelay());
  }

  async function RefreshSpotTradingPairs() {
    isRefreshing = true;
    await invalidate('admin:settings').finally(() => {
      setTimeout(() => {
        isRefreshing = false;
      }, getRandomDelay());
    });
  }

  let pairs: SpotTradingPair[] = [];
  $page.data.spotInfo.then((resp) => {
    if (resp.code != 200) return;
    pairs = resp.data.trading_pairs as SpotTradingPair[];
  }).catch(() => {
    pairs = [];
  });

  $: spotTradingPairs = pairs;
</script>

  {#if !spotTradingPairs}
    <div class="w-full h-full flex justify-center items-center">
      <button
        class="btn"
        on:click={() => {
          RefreshSpotTradingPairs();
        }}
        >
        {$_("reload")}
      </button>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th/>
            <th>{"symbol"}</th>
            <th>{"exchange_id"}</th>
            <th>{"ccxt_id"}</th>
            <th>{"base_asset_id"}</th>
            <th>{"quote_asset_id"}</th>
            <th>{"amount_significant_figures"}</th>
            <th>{"price_significant_figures"}</th>
            <th>{"buy_decimal_digits"}</th>
            <th>{"sell_decimal_digits"}</th>
            <th>{"max_buy_amount"}</th>
            <th>{"max_sell_amount"}</th>
            <th>{$_("enabled")}</th>
            <th>{$_("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {#if spotTradingPairs.length === 0}
            <tr>
              <td colspan="13" class="text-center">{$_("no_result_found")}</td>
            </tr>
          {/if}
          
          {#each spotTradingPairs as pair}
            <tr>
              <td/>
              <td>
                <span class="text-xs select-text"> {pair.symbol} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.exchange_id} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.ccxt_id} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.base_asset_id} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.quote_asset_id} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.amount_significant_figures} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.price_significant_figures} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.buy_decimal_digits} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.sell_decimal_digits} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.max_buy_amount} </span>
              </td>
              <td>
                <span class="text-xs select-text"> {pair.max_sell_amount} </span>
              </td>
              <td>
                <div class="tooltip" data-tip={isUpdating === pair.id ? $_("updating") : pair.enable ? $_("click_to_disable") : $_("click_to_enable")}>
                  <button on:click={async () => {
                    const newEnable = !pair.enable;
                    await UpdateSpotTradingPair(pair.id, newEnable);
                  }}>
                    <span class={clsx(isUpdating === pair.id && "loading loading-spinner loading-xs disabled")}>
                      {pair.enable ? '✅' : '❌'}
                    </span>
                  </button>
                </div>
              </td>
              <td>
                <button class="btn btn-ghost rounded-2xl btn-xs px-2" on:click={async () => { 
                  await DeleteSpotTradingPair(pair.id); 
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={clsx("size-4", isDeleting === pair.id && 'loading loading-spinner')}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-end mt-4 space-x-2">
      <details class="dropdown dropdown-end" bind:open={addDialog}>
        <summary class="btn m-1">
          <span>
            {$_("add")}
          </span>
        </summary>
        <div class="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
          <div class="p-2 flex flex-col gap-4"> 
            <div class="flex flex-col gap-2">
              <div class="flex items-center">
                <span class="label"> {"symbol"}</span>
                <span class="text-xs text-base-content/60"> (e.g. 'BTC/USDT')</span>
              </div>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewSymbol} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"exchange_id"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewExchangeId} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"ccxt_id"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewCcxtId} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"amount_significant_figures"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewAmountSignificantFigures} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"price_significant_figures"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewPriceSignificantFigures} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"buy_decimal_digits"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBuyDecimalDigits} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"sell_decimal_digits"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewSellDecimalDigits} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"max_buy_amount"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewMaxBuyAmount} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"max_sell_amount"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewMaxSellAmount} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"base_asset_id"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBaseAssetId} />
            </div>
            <div class="flex flex-col gap-2">
              <span class="label"> {"quote_asset_id"} </span>
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewQuoteAssetId} />
            </div>
            <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation mt-4" on:click={async () => {
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
                enable: true,
                id: getUuid(),
              });
              addDialog = false;
            }}>
              <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
                {$_("add")}
              </span>
            </button>
          </div>
        </div>
      </details>
      <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation" on:click={async () => {
          RefreshSpotTradingPairs();
      }}>
        <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
          {$_("refresh")}
        </span>
      </button>
    </div>
  {/if}