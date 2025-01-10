<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { getDepositAddressByKeyIdAndCurrency } from "$lib/helpers/hufi/admin/exchange";
  import ExchangeDepositCard from "$lib/components/admin/rebalance/deposit/exchangeDepositCard.svelte";

  $: depositAddress = '';
  $: depositMemo = '';
  $: minDepositAmount = '';
  $: minWithdrawalAmount = '';
  $: maxDepositAmount = '';
  $: maxWithdrawalAmount = '';
  let loading = false;
  let loaded = false;
  let failure = false;
  const keyId = $page.params.id;
  const currencyId = $page.params.currency;
  const networkId = $page.params.network;

  onMount(async () => {
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    loading = true;
    try {
      const result = await getDepositAddressByKeyIdAndCurrency(token, {
        apiKeyId: keyId,
        network: networkId,
        symbol: currencyId,
      });
      if (result.code === 500) {
        failure = true;
        toast.error(result.message);
        console.error(result.message);
      }
      const data = result.data;
      if (data) {
        depositAddress = data.address;
        depositMemo = data.memo;
        minDepositAmount = data.minium_deposit_amount;
        minWithdrawalAmount = data.minium_withdrawal_amount;
        maxDepositAmount = data.max_deposit_amount;
        maxWithdrawalAmount = data.max_withdrawal_amount;
        loaded = true;
      }
    } catch (error) {
      console.error('Error fetching deposit address:', error);
      failure = true;
    } finally {
      loading = false;
    }
  });
</script>

<!-- Header -->
<div class="flex items-center gap-2 p-4 bg-base-100">
  <!-- Arrow left -->
  <button class="btn btn-ghost btn-circle" on:click={() => { goto('/manage/rebalance/deposit') }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  </button>
  <!-- Title -->
  <h1 class="text-xl font-bold">{$_("deposit")}</h1>
</div>

<div class="flex flex-col text-wrap justify-center items-center">
  {#if loading}
    <div class="flex flex-col text-wrap justify-center items-center h-[calc(100vh-100px)]">
      <span class="loading loading-md"></span>
    </div>
  {:else if failure}
    <div class="flex flex-col space-y-4 text-wrap justify-center items-center h-[calc(100vh-100px)]">
      <span class="text-xl text-base-content">{$_('error_loading_deposit_info')}</span>
      <button class="btn btn-sm" on:click={() => {
        window.location.reload();
      }}>{$_('retry')}</button>
    </div>
  {:else if loaded}
    <ExchangeDepositCard
      currencyId={currencyId}
      chainSymbol={networkId}
      depositAddress={depositAddress}
      depositMemo={depositMemo}
      miniumDepositAmount={minDepositAmount}
      maxiumDepositAmount={maxDepositAmount}
    />
  {/if}
</div>
