<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import type { AdminCCXTCurrency } from "$lib/types/hufi/admin";
  import { getAllCurrenciesByKeyId } from "$lib/helpers/hufi/admin/exchange";
  
  let search = "";
  let currenciesLoading = false;
  let currencies: AdminCCXTCurrency[] = [];
  $: filteredCurrencies = currencies.filter((c: AdminCCXTCurrency) => {
    return c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
  });
  
  onMount(async () => {
    currenciesLoading = true;
    const token = localStorage.getItem('admin-access-token');
    if (!token) {
      return;
    }
    const keyId = $page.params.id;
    const res = (await getAllCurrenciesByKeyId(token, keyId)) as { data: Record<string, any> };
    if (!res) {
      return;
    }
    const crrs = Object.values(res.data) as AdminCCXTCurrency[];
    currencies = crrs.filter((c: AdminCCXTCurrency) => {
      return c.deposit === true && c.networks;
    });
    currenciesLoading = false;
  });
</script>

{#if currenciesLoading}
  <div class="flex items-center justify-center h-[calc(100vh-100px)]">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{:else}
  <div class="mx-8 mb-4">
    <div class="join border rounded-xl w-full">
      <button
        class="btn join-item btn-square border-none shadow-none no-animation focus:bg-base-100 bg-base-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
      <input
        type="text"
        bind:value={search}
        placeholder={$_("search")}
        class="input join-item block w-full bg-base-100 border-l-0 pl-0 focus:outline-none focus:border-0"
      />
    </div>
  </div>
  {#if filteredCurrencies.length > 0}
    <div class="flex flew-row flex-wrap gap-6 p-8 pt-2">
      {#each filteredCurrencies as currency}
        <details class="dropdown">
          <summary class="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-base-100 rounded-2xl shadow-md cursor-pointer">
            <div class="flex flex-col items-start justify-center min-w-24 space-y-0.5">
              <span class="text-xs text-left opacity-80">
                {currency.code}
              </span>
              <span class="text-xl font-semibold text-center">
                {currency.name}
              </span>
            </div>
          </summary>
          <!-- Select Network dropdown -->
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-1">
            <span class="text-xs opacity-60 m-4 my-2"> {$_('network')}</span>
            {#each Object.values(currency.networks) as network}
              <li>
                <button on:click={() => {
                  goto(`${$page.url.pathname}/${currency.id}/${network.id}`);
                  console.log(`${network.id} deposit min: ${network.limits.deposit.min}`);
                  console.log(`${network.id} deposit max: ${network.limits.deposit.max}`);
                  console.log(`${network.id} withdraw min: ${network.limits.withdraw.min}`);
                  console.log(`${network.id} withdraw max: ${network.limits.withdraw.max}`);
                  console.log(`${network.id} fee: ${network.fee}`);
                }}>
                  <span class="text-sm font-bold text-left">{network.id}</span>
                </button>
              </li>
            {/each}
          </ul>
        </details>
      {/each}
    </div>
  {/if}
{/if}