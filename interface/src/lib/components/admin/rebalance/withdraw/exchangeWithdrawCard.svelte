<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import toast from "svelte-french-toast";
  import { BN } from "$lib/helpers/utils";
  import { withdrawBalances } from "$lib/stores/admin";
  import emptyToken from "$lib/images/empty-token.svg";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import type { AdminCCXTCurrency } from "$lib/types/hufi/admin";
  import { getAllCurrenciesByKeyId } from "$lib/helpers/hufi/admin/exchange";

  let currenciesLoading = false;
  const currency = $page.params.currency;
  let currencies: AdminCCXTCurrency[] = [];

  let network: string;
  let address: string;
  let memo: string;
  let amount: string;
  let balance: number = 0;
  let validateErrorMessage: string = '';
  let isWithdrawEnabled: boolean = false;
  let withdrawLoading: boolean = false;
  let withdrawSuccess: boolean = false;
  let withdrawError: boolean = false;
  let withdrawErrorMessage: string = '';

  onMount(async () => {
    currenciesLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const keyId = $page.params.id;
    const ress = await getAllCurrenciesByKeyId(token, keyId);
    if (!ress) {
      toast.error('Failed to fetch currencies')
      return;
    }
    const crrs = Object.values(ress.data) as AdminCCXTCurrency[];
    currencies = crrs.filter((c: AdminCCXTCurrency) => {
      return c.withdraw === true && c.networks && c.code === currency;
    });
    currenciesLoading = false;

    balance = $withdrawBalances.find((b) => b.name === currency)?.amount || undefined;
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
    if (withdrawalFee > balance) {
      validateErrorMessage = $_('fee_exceeds_balance');
      return false;
    }
    if (!isWithdrawEnabled) {
      validateErrorMessage = $_('withdrawal_disabled');
      return false;
    }
    if (BN(amount).lt(BN(minAmount))) {
      validateErrorMessage = $_('amount_below_minimum');
      return false;
    }
    validateErrorMessage = '';
    return true;
  }

  function handleWithdraw() {
    if (validateWithdrawal()) {
      withdrawLoading = true;
      toast.success(`${network}, ${amount}, ${address}, ${memo}`);
    } else {
      toast.error(validateErrorMessage);
    }
    setTimeout(() => {
      withdrawLoading = false;
    }, 3000);
  }

  $: isWithdrawEnabled = currencies.length > 0 && currencies[0].networks[network]?.withdraw === true;
  $: withdrawalFee = currencies.length > 0 ? currencies[0].networks[network]?.fee : 0;
  $: minAmount = currencies.length > 0 ? currencies[0].networks[network]?.limits.withdraw.min : 0;
</script>

{#if currenciesLoading}
  <div class="flex items-center justify-center h-[calc(100vh-100px)]">
    <span class="loading loading-spinner loading-md" />
  </div>
{:else}
  {#if currencies.length > 0}
    <div class="flex flex-col items-center justify-center mb-24">
      <div class="flex flex-col mx-6 space-y-6 min-w-96 max-w-md p-8 card shadow-xl">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-2">
            <span class="text-xs font-light"> {$_('symbol')}</span>
            <span class="text-lg font-semibold"> {currencies[0].code}</span>
          </div>
          <img src={findCoinIconBySymbol(currencies[0].code) || emptyToken} alt={currencies[0].code} class="w-10 h-10" />
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('balance')}</span>
          <span class={clsx("text-lg font-semibold select-text", !balance && 'text-base text-red-700 opacity-70')}> {balance ? balance : $_('failed_to_fetch_balance')}</span>
        </div>

        <div class="flex flex-col space-y-2">
          <span class="text-xs font-light"> {$_('network')}</span>
          <select class="select select-bordered w-full max-w-xs focus:outline-none rounded-lg" bind:value={network}>
            {#each Object.values(currencies[0].networks) as networkOption}
              <option value={networkOption.network}>{networkOption.network}</option>
            {/each}
          </select>
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
          <span>
            - {$_('withdrawal_allowed')}: {isWithdrawEnabled ? '✅' : '❎'}
          </span>
          <span>
            - {$_('withdrawal_fee')}: {withdrawalFee}
          </span>
          <span>
            - {$_('minimum_amount')}: {minAmount}
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