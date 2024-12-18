<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getMixinDepositAddress } from "$lib/helpers/hufi/admin/rebalance";
  import MixinDepositCard from "$lib/components/admin/rebalance/deposit/mixinDepositCard.svelte";
    import { goto } from "$app/navigation";

  let asset;
  let chain;
  $: depositAddress = '';
  $: depositMemo = '';
  $: minDepositAmount = '';
  $: confirmations = '';
  let loading = false;
  let loaded = false;
  let failure = false;
  asset = $page.data.asset;
  chain = $page.data.chain;
  console.log(asset);
  console.log(chain);

  onMount(async () => {
    console.log(asset);
    console.log(chain);
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    loading = true;
    try {
      const result = await getMixinDepositAddress(asset.asset_id, token);
      console.log('getMixinDepositAddress', result.data);
      const data = result.data;
      if (data) {
        depositAddress = data.address;
        depositMemo = data.memo;
        minDepositAmount = data.minium_deposit_amount;
        confirmations = data.confirmations;
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
<div class="flex items-center gap-2 p-4 bg-white">
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
    <MixinDepositCard
      assetSymbol={asset.symbol}
      chainSymbol={chain.symbol}
      depositAddress={depositAddress}
      depositMemo={depositMemo}
      miniumDepositAmount={minDepositAmount}
      confirmations={confirmations}
    />
  {/if}
</div>
