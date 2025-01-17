<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import BigNumber from "bignumber.js";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { withdrawBalances } from "$lib/stores/admin";
  import { getBalanceByKeyId } from "$lib/helpers/hufi/admin/rebalance";
  
  let search = "";
  let balancesLoading = false;
  
  let balances: any[] = [];
  $: filteredBalances = balances.filter((c: any) => {
    return c.name.toLowerCase().includes(search.toLowerCase());
  });

  onMount(async () => {
    balancesLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const keyId = $page.params.id;
    
    const res = await getBalanceByKeyId(token, keyId);
    if (!res || !res.data) {
      toast.error(`Failed to fetch balance: ${res.message}`)
      return;
    }
    balances = Object.entries(res.data.free).map(([name, amount]) => ({
      name: name,
      amount: new BigNumber(amount).toFixed(),
    }));
    withdrawBalances.set(balances);
    balancesLoading = false;
  });
</script>

{#if balancesLoading}
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
          on:click={() => { goto(`/manage/rebalance/withdraw/exchange/${$page.params.id}/${balance.name}`) }}
        >
          <div class="flex flex-col items-start justify-center min-w-24 space-y-0.5">
            <span class="text-xs text-left opacity-80">
              {balance.name}
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