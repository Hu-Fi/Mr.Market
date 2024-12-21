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
    <input
      type="text"
      class="input input-bordered w-full focus:outline-none rounded-lg"
      placeholder={$_("search")}
      bind:value={search}
    />
  </div>
  {#if filteredCurrencies.length > 0}
    <div class="flex flew-row flex-wrap gap-6 p-8 pt-2">
      {#each filteredCurrencies as currency}
        <details class="dropdown">
          <summary class="flex flex-row items-center justify-center gap-2 px-6 py-2 bg-base-100 rounded-full shadow-md cursor-pointer">
            <div class="flex flex-col items-center justify-center">
              <span class="text-base font-bold text-center">{currency.code}</span>
              <span class="text-xs text-center opacity-60">{currency.name}</span>
            </div>
          </summary>
          <!-- Select Network dropdown -->
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-1">
            <span class="text-xs opacity-60 m-4 my-2"> {$_('network')}</span>
            {#each Object.values(currency.networks) as network}
              <li>
                <button on:click={() => {
                  goto(`${$page.url.pathname}/${currency.id}/${network.id}`);
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