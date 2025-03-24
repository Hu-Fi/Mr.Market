<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { getSupportedExchanges } from "$lib/helpers/hufi/admin/growdata";
  $: supportedExchanges = [];
  $: exchanges = $page.data.growInfo.exchanges as {
    exchange_id: string;
    name: string;
    enable: boolean;
  }[];
  
  let AddNewName = "";
  let AddNewExchangeId = "";

  let addDialog = false;
  let isAdding = false;
  // let isUpdating = '';
  // let isDeleting = '';
  let isRefreshing = false;
  // async function AddExchange(name: string, exchangeId: string) {
  //   if (!name || !exchangeId) return;
  //   isAdding = true;
  //   const token = localStorage.getItem('admin-access-token');
  //   if (!token) return;
  //   await addExchange({name, exchange_id: exchangeId}, token);
  //   setTimeout(() => {
  //     invalidate('admin:settings').finally(() => {
  //       isAdding = false;
  //       addDialog = false;
  //       AddNewName = '';
  //       AddNewExchangeId = '';
  //     });
  //   }, getRandomDelay());
  // }

  // async function UpdateExchange(exchange_id: string, name: string, enable: boolean) {
  //   if (!exchange_id) return;
  //   isUpdating = exchange_id;
  //   const token = localStorage.getItem('admin-access-token');
  //   if (!token) return;
  //   await updateExchange(exchange_id, {exchange_id, name, enable}, token);
  //   setTimeout(() => {
  //     invalidate('admin:settings').finally(() => {
  //       isUpdating = '';
  //     });
  //   }, getRandomDelay());
  // }

  // async function DeleteExchange(exchange_id: string) {
  //   if (!exchange_id) return;
  //   isDeleting = exchange_id;
  //   const token = localStorage.getItem('admin-access-token');
  //   if (!token) return;
  //   await removeExchange(exchange_id, token);
  //   setTimeout(() => {
  //     invalidate('admin:settings').finally(() => {
  //       isDeleting = '';
  //     });
  //   }, getRandomDelay());
  // }

  async function RefreshExchanges() {
    isRefreshing = true;
    setTimeout(() => {
      invalidate('admin:settings').finally(() => {
        isRefreshing = false;
      });
    }, getRandomDelay());
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
  }

  onMount(async () => {
    const token = localStorage.getItem('admin-access-token');
    if (!token) return;
    const resp = await getSupportedExchanges(token);
    if (resp.code != 200) {
      return;
    }

    supportedExchanges = resp.data;
    exchanges = $page.data.growInfo.data.exchanges;
  });
</script>

{#if !exchanges}
  <div class="w-full h-full flex justify-center items-center">
    <button
      class="btn btn-base-300 no-animation"
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
          <th></th>
          <th>{$_("display_name")}</th>
          <th>{$_("exchange_id")}</th>
          <th>
            <div class="flex items-center gap-2">
              <span>
              {$_("supported")}
            </span>
            <div class="tooltip tooltip-bottom" data-tip={$_("admin_exchange_supported_info")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
          </th>
          <th>
            <div class="flex items-center gap-2">
              <span>
                {$_("enabled")}
              </span>
              <div class="tooltip tooltip-bottom" data-tip={$_("admin_exchange_enable_info")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
          </th>
          <th>{$_("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {#if exchanges.length === 0}
          <tr>
            <td colspan="5" class="text-center">{$_("no_result_found")}</td>
          </tr>
        {/if}
        
        {#each exchanges as exchange}
          <tr>
            <td />
            <td>{exchange.name}</td>
            <td>{exchange.exchange_id}</td>
            <td>{supportedExchanges.includes(exchange.exchange_id) ? '✅' : '❌'}</td>
            <!-- <td>
              <div class="tooltip" data-tip={!isUpdating ? exchange.enable ? $_("click_to_disable") : $_("click_to_enable") : $_("updating")}>
                <button on:click={async () => {
                  const newEnable = !exchange.enable;
                  await UpdateExchange(exchange.exchange_id, exchange.name, newEnable);
                }}>
                  <span class={clsx(isUpdating === exchange.exchange_id && "loading loading-spinner loading-xs disabled")}>
                    {exchange.enable ? '✅' : '❌'}
                  </span>
                </button>
              </div>
            </td>
            <td>
              <button class="btn btn-ghost rounded-2xl btn-xs px-2" on:click={async () => { 
                await DeleteExchange(exchange.exchange_id); 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={clsx("size-4", isDeleting === exchange.exchange_id && 'loading loading-spinner')}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>                
              </button>
            </td> -->
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
            <span class="label"> {$_("display_name")} </span>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewName} />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center">
              <span class="label"> {$_("exchange_id")} </span> 
              <span class="text-xs text-base-content/60"> {'(ccxt id e.g. binance)'} </span>
            </div>
            <input type="text" class="input input-bordered focus:outline-none" bind:value={AddNewExchangeId} />
          </div>
          <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation" on:click={async () => {
            // await AddExchange(AddNewName, AddNewExchangeId);
          }}>
            <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
              {$_("add")}
            </span>
          </button>
        </div>
      </div>
    </details>

    <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation" on:click={() => {
      RefreshExchanges();
    }}>
      <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
        {$_("refresh")}
      </span>
    </button>
  </div>
{/if}
