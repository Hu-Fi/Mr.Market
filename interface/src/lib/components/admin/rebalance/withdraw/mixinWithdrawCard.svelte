<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import toast from "svelte-french-toast";
  import { BN } from "$lib/helpers/utils";
  import emptyToken from "$lib/images/empty-token.svg";
  import { getMixinWithdrawInfo } from "$lib/helpers/hufi/admin/rebalance";

  let assetLoading = false;
  let asset: unknown;
  let chain: unknown;
  let address: string;
  let memo: string;
  let amount: string;
  let balance: number = 0;
  let validateErrorMessage: string = '';
  let withdrawalFee: string;
  let withdrawLoading: boolean = false;
  let withdrawSuccess: boolean = false;
  let withdrawError: boolean = false;
  let withdrawErrorMessage: string = '';
  let feeAsset: string;
  onMount(async () => {
    assetLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const asset_id = $page.params.id;
    const resp = await getMixinWithdrawInfo(token, asset_id);
    if (!resp || !resp.data) {
      toast.error('Failed to fetch withdraw info')
      return;
    }
    console.log(resp);
    assetLoading = false;

    asset = resp.data.asset;
    chain = resp.data.chain;
    balance = BN(resp.data.balance).toFixed();
    const fees = resp.data.fee;
    const highestPriorityFee = fees.sort((a, b) => b.priority - a.priority)[0];
    withdrawalFee = highestPriorityFee.amount;
    feeAsset = highestPriorityFee.asset_id;
  });

  function validateWithdrawal() {
    if (!address) {
      validateErrorMessage = $_('address_is_required');
      return false;
    }
    if (!amount) {
      validateErrorMessage = $_('amount_is_required');
      return false;
    }
    if (parseFloat(amount) > balance) {
      validateErrorMessage = $_('insufficient_balance');
      return false;
    }
    if (BN(withdrawalFee).gt(BN(balance))) {
      validateErrorMessage = $_('fee_exceeds_balance');
      return false;
    }
    validateErrorMessage = '';
    return true;
  }

  function handleWithdraw() {
    if (validateWithdrawal()) {
      withdrawLoading = true;
      toast.success(`${asset.symbol}, ${amount}, ${address}, ${memo}`);
    } else {
      toast.error(validateErrorMessage);
    }
    setTimeout(() => {
      withdrawLoading = false;
    }, 3000);
  }
</script>

{#if assetLoading}
  <div class="flex items-center justify-center h-[calc(100vh-100px)]">
    <span class="loading loading-spinner loading-md" />
  </div>
{:else}
  {#if asset}
    <div class="flex flex-col items-center justify-center mb-24">
      <div class="flex flex-col mx-6 space-y-6 min-w-96 max-w-md p-8 card shadow-xl">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-2">
            <span class="text-xs font-light"> {$_('symbol')}</span>
            <span class="text-lg font-semibold"> {asset.symbol}</span>
          </div>
          <img src={asset.icon_url || emptyToken} alt={asset.symbol} class="w-10 h-10" />
        </div>

        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-2">
            <span class="text-xs font-light"> {$_('network')}</span>
            <span class="text-lg font-semibold"> {chain.name}</span>
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('balance')}</span>
          <span class={clsx("text-lg font-semibold select-text", !balance && 'text-base text-red-700 opacity-70')}> {balance ? balance : $_('failed_to_fetch_balance')}</span>
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('address')}</span>
          <input type="text" class="input input-bordered w-full focus:outline-none rounded-lg" placeholder={$_('address')} bind:value={address} />
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('memo')}</span>
          <input type="text" class="input input-bordered w-full focus:outline-none rounded-lg" placeholder={$_('memo')} bind:value={memo} />
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('amount')}</span>
          <input type="text" class="input input-bordered w-full focus:outline-none rounded-lg" placeholder={$_('amount')} bind:value={amount} />
        </div>

        <div class="flex flex-col items-start justify-center bg-base-100 rounded-lg py-0 space-y-1 text-xs font-light opacity-60">
          <span class="select-text">
            - {$_('withdrawal_fee')}: {withdrawalFee}
          </span>
          <span class="select-text"> 
            - {$_('fee_asset')}: {feeAsset === asset.asset_id ? asset.symbol : feeAsset}
          </span>
        </div>
        <button class="btn btn-base-300 no-animation" on:click={handleWithdraw} disabled={withdrawLoading}>
          {#if withdrawLoading}
            <span class="loading loading-spinner loading-md" />
          {:else}
            {$_('withdraw')}
          {/if}
        </button>
      </div>

      {#if withdrawSuccess || withdrawError}
        <div class="mt-4 card">
          <div class="flex flex-col items-center justify-center card-body bg-base-100 shadow-lg rounded-2xl w-96">
            {#if withdrawSuccess}
              <span class="text-sm"> {$_('withdraw_success')}</span>
            {:else if withdrawError}
              <span class="text-sm"> {$_('withdraw_error')}</span>
              <span class="text-sm"> {withdrawErrorMessage}</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex items-center justify-center h-[calc(100vh-100px)]">
      <h2 class="text-lg"> {$_('unable_to_withdraw_asset')}</h2>
    </div>
  {/if}
{/if}