<script lang="ts">
  import clsx from "clsx";
  import { validate } from "uuid";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { mixinAsset } from "$lib/helpers/mixin";
  import { getRandomDelay } from "$lib/helpers/utils";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import type { ArbitragePair, ArbitragePairDto } from "$lib/types/hufi/grow";
  import { addArbitragePair, updateArbitragePair, removeArbitragePair } from "$lib/helpers/hufi/admin/growdata";

  $: arbitragePairs = $page.data.growInfo.arbitrage.pairs as ArbitragePair[];

  let AddNewSymbol = "";
  let AddNewBaseSymbol = "";
  let AddNewTargetSymbol = "";
  let AddNewBaseAssetId = "";
  let AddNewBaseIconUrl = "";
  let AddNewTargetAssetId = "";
  let AddNewTargetIconUrl = "";
  let AddNewBaseExchangeId = "";
  let AddNewTargetExchangeId = "";

  let addDialog = false;
  let isAdding = false;
  let isUpdating = '';
  let isDeleting = '';
  let isRefreshing = false;
  let isBaseIconFetching = false;
  let isTargetIconFetching = false;

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
    AddNewBaseExchangeId = "";
    AddNewTargetExchangeId = "";
  }

  async function AddArbitragePair(pair: ArbitragePairDto) {
    if (!pair.symbol || !pair.base_symbol || !pair.target_symbol || !pair.base_exchange_id || !pair.target_exchange_id || !pair.base_asset_id || !pair.target_asset_id) return;
    isAdding = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    addArbitragePair(pair, token).then(() => {
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

  async function UpdateArbitragePair(id: string, enable: boolean) {
    if (!id) return;
    isUpdating = id;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    await updateArbitragePair(id, {enable}, token).catch((error) => {
      console.error(error);
    });
    
    setTimeout(() => {
      invalidate('admin:settings').finally(() => {
        isUpdating = '';
      });
    }, getRandomDelay());
  }

  async function DeleteArbitragePair(id: string) {
    if (!id) return;
    isDeleting = id;
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    await removeArbitragePair(id, token);
    setTimeout(() => {
      invalidate('admin:settings').finally(() => {
        isDeleting = '';
      });
    }, getRandomDelay());
  }

  async function RefreshArbitragePairs() {
    isRefreshing = true;
    await invalidate('admin:settings').finally(() => {
      setTimeout(() => {
        isRefreshing = false;
      }, getRandomDelay());
    });
  }
</script>

{#if !arbitragePairs}
  <div class="w-full h-full flex justify-center items-center">
    <button
      class="btn btn-primary"
      on:click={() => {
        window.location.reload();
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
          <th>{"base_symbol"}</th>
          <th>{"target_symbol"}</th>
          <th>{"id"}</th>
          <th>{"base_asset_id"}</th>
          <th>{"target_asset_id"}</th>
          <th>{"base_exchange_id"}</th>
          <th>{"target_exchange_id"}</th>
          <th>{"base_icon_url"}</th>
          <th>{"target_icon_url"}</th>
          <th>{$_("enabled")}</th>
          <th>{$_("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {#if arbitragePairs.length === 0}
          <tr>
            <td colspan="10" class="text-center">{$_("no_result_found")}</td>
          </tr>
        {/if}
        
        {#each arbitragePairs as pair}
          <tr>
            <td/>
            <td>
              <span class="text-xs select-text"> {pair.symbol} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.base_symbol} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.target_symbol} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.id} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.base_asset_id} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.target_asset_id} </span>
            </td>
            <td>
              <span class="text-xs select-text"> {pair.base_exchange_id} </span>
            </td> 
            <td>
              <span class="text-xs select-text"> {pair.target_exchange_id} </span>
            </td>
            <td class="cursor-pointer" on:click={() => {
              window.open(pair.base_icon_url, '_blank');
            }}>
              <div class="tooltip" data-tip="Click to open in new tab">
                <img src={pair.base_icon_url} class="w-6 h-6" alt="" />
              </div>
            </td>
            <td class="cursor-pointer" on:click={() => {
              window.open(pair.target_icon_url, '_blank');
            }}>
              <div class="tooltip" data-tip="Click to open in new tab">
                <img src={pair.target_icon_url} class="w-6 h-6" alt="" />
              </div>
            </td>
            <td>
              <div class="tooltip" data-tip={isUpdating === pair.id ? $_("updating") : pair.enable ? $_("click_to_disable") : $_("click_to_enable")}>
                <button on:click={async () => {
                  const newEnable = !pair.enable;
                  await UpdateArbitragePair(pair.id, newEnable);
                }}>
                  <span class={clsx(isUpdating === pair.id && "loading loading-spinner loading-xs disabled")}>
                    {pair.enable ? '✅' : '❌'}
                  </span>
                </button>
              </div>
            </td>
            <td>
              <button class="btn btn-ghost rounded-2xl btn-xs px-2" on:click={async () => { 
                await DeleteArbitragePair(pair.id); 
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
            <span class="label"> {"base_symbol"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBaseSymbol} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"target_symbol"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewTargetSymbol} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"base_asset_id"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBaseAssetId} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"target_asset_id"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewTargetAssetId} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"base_exchange_id"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBaseExchangeId} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"target_exchange_id"} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewTargetExchangeId} />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"base_icon_url"} </span>
            {#if !AddNewBaseIconUrl && validate(AddNewBaseAssetId)}
              <button class="btn btn-bordered btn-md no-animation" on:click={async () => {
                isBaseIconFetching = true;
                const asset = await mixinAsset(AddNewBaseAssetId);
                AddNewBaseIconUrl = asset.icon_url;
                isBaseIconFetching = false;
              }}>
                <span class={clsx(isBaseIconFetching && "loading loading-spinner loading-sm")}>
                  {$_("fetch")}
                </span>
              </button>
            {:else}
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewBaseIconUrl} />
            {/if}
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"target_icon_url"} </span>
            {#if !AddNewTargetIconUrl && validate(AddNewTargetAssetId)}
              <button class="btn btn-bordered btn-md no-animation" on:click={async () => {
                isTargetIconFetching = true;
                const asset = await mixinAsset(AddNewTargetAssetId);
                AddNewTargetIconUrl = asset.icon_url;
                isTargetIconFetching = false;
              }}>
                <span class={clsx(isTargetIconFetching && "loading loading-spinner loading-sm")}>
                  {$_("fetch")}
                </span>
              </button>
            {:else}
              <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewTargetIconUrl} />
            {/if}
          </div>

          <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation mt-4" on:click={async () => {
            await AddArbitragePair({
              id: getUuid(),
              symbol: AddNewSymbol,
              base_symbol: AddNewBaseSymbol,
              target_symbol: AddNewTargetSymbol,
              base_asset_id: AddNewBaseAssetId,
              base_icon_url: AddNewBaseIconUrl,
              target_asset_id: AddNewTargetAssetId,
              target_icon_url: AddNewTargetIconUrl,
              base_exchange_id: AddNewBaseExchangeId,
              target_exchange_id: AddNewTargetExchangeId,
              enable: true,
            });
          }}>
            <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
              {$_("add")}
            </span>
          </button>
        </div>
      </div>
    </details>
    <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation" on:click={async () => {
      await RefreshArbitragePairs();
    }}>
      <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
        {$_("refresh")}
      </span>
    </button>
  </div>
{/if}
