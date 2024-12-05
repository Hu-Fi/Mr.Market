<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  let addDialog = false;
  let isAdding = false;
  let isRefreshing = false;
  let AddNewName = "";
  let AddNewExchangeId = "";
  const AddExchange = async () => {
    console.log(AddNewName, AddNewExchangeId);
  };
</script>


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
            await AddExchange(AddNewName, AddNewExchangeId);
          }}>
            <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
              {$_("add")}
            </span>
          </button>
        </div>
      </div>
    </details>

    <button class="btn bg-base-200 hover:bg-base-200 border-none no-animation" on:click={() => {
      
    }}>
      <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
        {$_("refresh")}
      </span>
    </button>
  </div>