<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import BigNumber from "bignumber.js";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { getMixinBalance } from "$lib/helpers/hufi/admin/rebalance";
  
  // Fetch balance
  // Show balance and amount
  let search = "";
  let currenciesLoading = false;
  let balances: { symbol: string, asset_id: string, amount: string }[] = [];
  $: filteredBalances = balances.filter((c: { symbol: string, asset_id: string, amount: string }) => {
    return c.symbol.toLowerCase().includes(search.toLowerCase());
  });
  
  onMount(async () => {
    currenciesLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const res = await getMixinBalance(token, 'list');
    if (!res || !res.data) {
      toast.error('Failed to fetch balance')
      return;
    }
    console.log(res.data);
    balances = res.data.map(({ symbol, asset_id, balance }) => ({
      symbol: symbol,
      asset_id: asset_id,
      amount: new BigNumber(balance).toFixed(),
    }));
    currenciesLoading = false;
  });
</script>

{#if currenciesLoading}
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
    />
  </div>
  {#if filteredBalances.length > 0}
    <div class="flex flew-row flex-wrap gap-6 p-8 pt-2">
      {#each filteredBalances as balance}
        <button 
          class="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-base-100 rounded-2xl shadow-md"
          on:click={() => {
            goto(`/manage/rebalance/withdraw/mixin/${balance.asset_id}`);
          }}
        >
          <div class="flex flex-col items-start justify-center min-w-24 space-y-0.5">
            <span class="text-xs text-left opacity-80">
              {balance.symbol}
            </span>
            <span class="text-xl font-semibold text-center">
              {balance.amount}
            </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
{/if}