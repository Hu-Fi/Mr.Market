<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { addMinimumBalanceSetting } from "$lib/helpers/hufi/admin/minBalances";

  let loading: boolean, showError: boolean, resultMessage: string;
  let items = {
    'asset_id': '',
    'symbol': '',
    'exchange_name': '',
    'minimum_balance': '',
  }
  
  const createNewMinimumBalance = async () => {
    loading=true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      console.error("Unable to fetch admin endpoint without jwt token");
      return;
    }

    try {
      await addMinimumBalanceSetting(token, { 
        symbol: items.symbol,
        assetId: items.asset_id,
        exchangeName: items.exchange_name,
        minimumBalance: items.minimum_balance,
      })
      loading = false;
      showError = false;
      resultMessage = '';
    } catch(e: unknown) {
      loading = false;
      showError=true;
      resultMessage=e.message;
    }
    return 
  }
</script>

<div>
  <div class="m-7 flex items-center space-x-3">
    <button
      on:click={() => {
        goto("/manage/rebalance");
      }}
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
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </button>
    <span class="font-bold">
      {$_("create_new_minimum_balance_record")}
    </span>
  </div>

  <div class="h-[50vh] mb-32 flex flex-col space-y-6 mx-7">
    {#each Object.keys(items) as item}
      <div class="flex flex-col space-y-3">
        <span class="text-sm"> {$_(item)} </span>
        <input
          type="text"
          placeholder="Type here"
          bind:value={items[item]}
          class="input input-bordered w-full max-w-xs focus:outline-none"
        />
      </div>
    {/each}

    <div>
      <button on:click={()=>{createNewMinimumBalance()}} class="btn">
        <span class={loading ? 'loading':''}> {$_('create')} </span>
      </button>
    </div>

    {#if showError}
      <div>
        <span>{resultMessage}</span>
      </div>
    {/if}
  </div>
</div>
