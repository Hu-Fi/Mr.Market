<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import BigNumber from "bignumber.js";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import type { AdminCCXTCurrency } from "$lib/types/hufi/admin";
  import { getMixinBalance } from "$lib/helpers/hufi/admin/rebalance";
  
  // Fetch balance
  // Show balance and amount
  let search = "";
  let currenciesLoading = false;
  let balances: { name: string, amount: string }[] = [];
  $: filteredBalances = balances.filter((c: { name: string, amount: string }) => {
    return c.name.toLowerCase().includes(search.toLowerCase());
  });
  
  onMount(async () => {
    currenciesLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const res = await getMixinBalance(token);
    if (!res) {
      toast.error('Failed to fetch balance')
      return;
    }
    balances = Object.entries(res.data).map(([name, amount]) => ({
      name: name,
      amount: new BigNumber(amount).toFixed(),
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
        <div class="flex flex-row items-center justify-center gap-2 px-6 py-2 bg-base-100 rounded-full shadow-md cursor-pointer">
          <div class="flex flex-col items-center justify-center">
            <span class="text-base font-bold text-center">{balance.name}</span>
            <span class="text-xs text-center opacity-60">{balance.amount}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}