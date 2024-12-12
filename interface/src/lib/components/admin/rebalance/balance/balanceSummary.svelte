<script>
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { balances } from "$lib/stores/admin";
  import BalanceCard from './balanceSimpleCard.svelte';
  import Loading from "$lib/components/common/loading.svelte";
  import { getAllBalances } from "$lib/helpers/hufi/admin/rebalance";

  let balance = [];
  let balanceLoading = false;

  onMount(async () => {
    const token = localStorage.getItem('admin-access-token');
    if (token) {
      balanceLoading = true;
      balance = await getAllBalances(token);
      balances.set(balance);
    }
    balanceLoading = false;
    console.log(balance);
  });
</script>

<!-- Balances Section -->
<div class="py-4 space-y-4">
  <!-- Title -->
   <div class="flex justify-between items-center">
    <div class="text-xl font-bold">{$_("balance")}</div>
    <button class="btn btn-ghost flex items-center" on:click={() => goto("/manage/rebalance/balances")}>
      <span>
        {$_("view_all")}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>    
    </button>
   </div>

  <!-- Top Balances Section -->
  <div class="flex flex-wrap items-center gap-4">
    {#if balanceLoading}
      <Loading />
    {:else if balance.length > 0}
      {#each balance as info}
        <BalanceCard {info} />
      {/each}
    {:else}
      <div class="text-center text-gray-500">{$_("no_balance_in_wallet")}</div>
    {/if}
  </div>
</div>
