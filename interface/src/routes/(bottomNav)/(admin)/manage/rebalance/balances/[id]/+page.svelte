<script>
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/common/loading.svelte";
  import { getBalanceByKeyId } from "$lib/helpers/hufi/admin/rebalance";
  import SingleAssetBalance from "$lib/components/admin/rebalance/balance/singleAssetBalance.svelte";

  let balance = [];
  let loading = false;
  let errorMessage = '';

  onMount(async () => {
    loading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return 
    }
    const result = await getBalanceByKeyId(token, $page.params.id)
    if (result && result.code === 200) {
      if ($page.params.id === '0') {
        // Mixin balance
        balance = Object.entries(result.data).map(([symbol, amount]) => ({ symbol, amount }));
      } else {
        // Exchange balance
        balance = Object.entries(result.data.total).map(([symbol, amount]) => ({ symbol, amount }));
      }
    } else {
      errorMessage = $_("failed_to_fetch_balance");
    }
    loading = false;
  })
</script>

<!-- Header -->
<div class="flex items-center gap-2 p-4 bg-base-100">
  <!-- Arrow left -->
  <button class="btn btn-ghost btn-circle" on:click={() => { goto('/manage/rebalance/') }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  </button>
  <!-- Title -->
  <h1 class="text-xl font-bold">{$_("balance")}</h1>
</div>


{#if loading}
  <div class="flex justify-center items-center h-[calc(100vh-100px)]">
    <Loading />
  </div>
{:else if errorMessage}
  <div class="flex justify-center items-center h-[calc(100vh-100px)]">
    <div class="text-red-500">
      {errorMessage}
    </div>
  </div>
{:else}
  {#if balance.length > 0}
    <div class="flex flex-col px-6">
      {#each balance as { symbol, amount }}
        <SingleAssetBalance symbol={symbol} amount={amount} />
      {/each}
    </div>
  {/if}
{/if}