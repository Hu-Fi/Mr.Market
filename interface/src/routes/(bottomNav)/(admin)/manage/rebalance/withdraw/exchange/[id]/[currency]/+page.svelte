<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
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
  });
</script>

<div class="flex flex-col min-h-screen bg-base-100">
  <!-- Header -->
  <div class="flex items-center gap-2 p-4 bg-base-100">
    <!-- Arrow left -->
    <button class="btn btn-ghost btn-circle" on:click={() => { goto(`/manage/rebalance/withdraw/exchange/${$page.params.id}`) }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </button>
    <!-- Title -->
    <h1 class="text-xl font-bold">{$_("withdraw")}</h1>
  </div>
  {#if currenciesLoading}
    <div class="flex items-center justify-center h-[calc(100vh-100px)]">
      <span class="loading loading-spinner loading-md" />
    </div>
  {:else}
    {#if currencies.length > 0}
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col mx-6 space-y-6 w-96 p-8">
          <div class="flex flex-row items-center justify-between">
            <div class="flex flex-col space-y-2">
              <span class="text-xs font-light"> {$_('symbol')}</span>
              <span class="text-lg font-semibold"> {currencies[0].info.symbol}</span>
            </div>
            <img src={findCoinIconBySymbol(currencies[0].info.symbol) || emptyToken} alt={currencies[0].info.symbol} class="w-10 h-10" />
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

          <div class="flex flex-col items-start justify-center bg-base-100 rounded-lg p-2 space-y-1 text-xs font-light opacity-60">
            <span>
              {$_('fee')}: {currencies.length > 0 ? currencies[0].networks[network]?.fee : ''}
            </span>
            <span>
              {$_('minimum_amount')}: {currencies.length > 0 ? currencies[0].networks[network]?.limits.withdraw.min : ''}
            </span>
          </div>
          <button class="btn btn-base-300" on:click={() => {
            console.log(network, amount, address, memo);
          }}>
            {$_('withdraw')}
          </button>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center h-[calc(100vh-100px)]">
        <h2 class="text-lg"> {$_('no_result_found')}</h2>
      </div>
    {/if}

    <!-- {#each currencies as currency}
      {#each Object.values(currency.networks) as network}
        <div class="p-4 border-b">
          <h2 class="text-lg font-bold">{currency.info.symbol}</h2>
          <p>Network: {network.network} </p>
          <p>Withdrawal Fee: {network.fee}</p>
          <p>Minimum Withdrawal Amount: {network.limits.withdraw.min}</p>
          <p>Is Withdraw Allowed: {network.withdraw ? 'Yes' : 'No'}</p>
        </div>
      {/each}
    {/each} -->
  {/if}
</div>