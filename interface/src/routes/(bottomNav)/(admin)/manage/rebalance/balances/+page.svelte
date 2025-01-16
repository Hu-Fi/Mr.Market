<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';
  import Loading from '$lib/components/common/loading.svelte';
  import { getAllBalancesWp } from '$lib/helpers/hufi/admin/rebalance';
  import { balances, balancesLoaded, balancesLoading } from '$lib/stores/admin';
  import BalancesComplexCard from '$lib/components/admin/rebalance/balance/balancsComplexCard.svelte';

  let isRefresh = 'false';

  onMount(async () => {
    refreshBalances();
  });

  async function refreshBalances() {
    const token = localStorage.getItem('admin-access-token');
    if (token) {
      await getAllBalancesWp(token, isRefresh);
      if (isRefresh == 'true') {
        toast.success(`${$_("refresh_success")}!`);
      }
    } else {
      toast.error(`${$_("refresh_failed")}!`);
    }
  }
</script>

<div class="p-4">
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2 mb-4">
      <!-- Arrow left -->
      <button class="btn btn-ghost btn-circle" on:click={() => {history.back()}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <!-- Title -->
      <div class="text-xl font-bold">{$_("balance")}</div>
    </div>
    <div class="tooltip tooltip-bottom" data-tip={$_("refresh")}>
      <button class="btn btn-ghost btn-circle" on:click={() => {isRefresh = 'true'; refreshBalances()}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div>
  </div>
  {#if $balancesLoading}
    <div class="flex justify-center items-center h-[calc(100vh-100px)]">
      <Loading />
    </div>
  {:else}
    <div class="flex flex-wrap items-start gap-4 h-full px-4">
      {#if $balancesLoaded && $balances.length > 0}
        {#each $balances as balance}
          <BalancesComplexCard info={balance} path={`/manage/rebalance/balances/${balance.key_id}`} />
        {/each}
      {:else}
        <div class="text-center text-base-300">{$_("no_balance_in_wallet")}</div>
      {/if}
    </div>
  {/if}
</div>